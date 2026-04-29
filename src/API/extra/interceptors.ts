import { AxiosError, AxiosRequestConfig } from 'axios';
import i18n from 'i18next';
import Toast from 'react-native-toast-message';

import { API } from '@API/index';
import { hasInternetConnection } from '@extra/hasInternetConnection';
import { useUserStore } from '@stores/userStore';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@keychain/extra/constants';
import { keychain } from '@keychain/index';

function shellEscapeSingleQuotes(value: string) {
  // Wrap in single-quotes and escape existing single-quotes for POSIX shells.
  return `'${value.replace(/'/g, `'\"'\"'`)}'`;
}

function toCurl(config: AxiosRequestConfig) {
  const method = (config.method ?? 'get').toUpperCase();
  const baseURL = config.baseURL ?? '';
  const url = `${baseURL}${config.url ?? ''}`;

  const parts: string[] = [`curl -X ${method}`, shellEscapeSingleQuotes(url)];

  const headers = (config.headers ?? {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v == null) continue;
        parts.push('-H', shellEscapeSingleQuotes(`${key}: ${String(v)}`));
      }
      continue;
    }
    parts.push('-H', shellEscapeSingleQuotes(`${key}: ${String(value)}`));
  }

  if (config.data != null) {
    const data =
      typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data);
    parts.push('--data-raw', shellEscapeSingleQuotes(data));
  }

  return parts.join(' ');
}

API.interceptors.request.use(
  async config => {
    const hasInternet = await hasInternetConnection();
    if (!hasInternet) {
      return config;
    }

    const accessToken = await keychain.getItem(ACCESS_TOKEN);
    const existingAuthHeader = (config.headers as Record<string, unknown>)
      ?.Authorization;

    if (accessToken && typeof existingAuthHeader !== 'string') {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Debug: log request as curl command
    // console.log(toCurl(config));

    console.log(
      '[API] request data:',
      config.method?.toUpperCase(),
      config.url,
      config.data && config.data,
    );

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  response => {
    console.log(
      '[API] response:',
      response.config.method?.toUpperCase(),
      response.status,
      response.config.url,
      response.data && response.data,
    );
    return response;
  },
  async error => {
    const axiosError = error as AxiosError;
    console.log(
      '[API] error:',
      axiosError.config?.method?.toUpperCase(),
      axiosError.response?.status,
      axiosError.config?.url,
      axiosError.response?.data,
    );

    const originalConfig = axiosError.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = axiosError.response?.status;
    let toastWasShown = false;

    if (error.response?.status === 429) {
      Toast.show({
        type: 'error',
        text1: i18n.t('tooManyRequestsTryAgainLater'),
      });
      toastWasShown = true;
    }

    if (error.response?.status === 500) {
      Toast.show({
        type: 'error',
        text1: i18n.t('anUnexpectedErrorOccurredPleaseTryAgainLater'),
      });
      toastWasShown = true;
    }

    if (error.response?.status === 401 && !originalConfig?._retry) {
      originalConfig._retry = true;

      const refreshToken = await keychain.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        originalConfig.headers = {
          ...(originalConfig.headers ?? {}),
          Authorization: `Bearer ${refreshToken}`,
        };

        const refreshedResponse = await API.request(originalConfig);

        const nextAccessToken = (
          refreshedResponse.data as { accessToken?: string } | undefined
        )?.accessToken;
        const nextRefreshToken = (
          refreshedResponse.data as { refreshToken?: string } | undefined
        )?.refreshToken;

        if (typeof nextAccessToken === 'string') {
          await keychain.setItem(ACCESS_TOKEN, nextAccessToken);
        }
        if (typeof nextRefreshToken === 'string') {
          await keychain.setItem(REFRESH_TOKEN, nextRefreshToken);
        }

        return refreshedResponse;
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Все остальные ошибки
    if (!toastWasShown && status !== 401) {
      Toast.show({
        type: 'error',
        text1: i18n.t('somethingWentWrong'),
      });
    }

    return Promise.reject(error);
  },
);
