import { AxiosError, AxiosRequestConfig } from 'axios';
import i18n from 'i18next';
import Toast from 'react-native-toast-message';

import { API } from '@API/index';
import { hasInternetConnection } from '@extra/hasInternetConnection';
import { useUserStore } from '@stores/userStore';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@keychain/extra/constants';
import { keychain } from '@keychain/index';

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

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  response => response,
  async error => {
    const axiosError = error as AxiosError;

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
