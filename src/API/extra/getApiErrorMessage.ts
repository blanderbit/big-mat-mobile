import { AxiosError } from 'axios';
import i18n from 'i18next';
import Toast from 'react-native-toast-message';

export type ApiErrorBody = {
  success?: boolean;
  code?: string;
  message?: string;
  description?: string;
};

export function getApiErrorBody(error: unknown): ApiErrorBody | null {
  const axiosError = error as AxiosError<
    ApiErrorBody | { data?: ApiErrorBody }
  >;
  const responseData = axiosError.response?.data;

  if (!responseData || typeof responseData !== 'object') {
    return null;
  }

  if ('code' in responseData || 'message' in responseData) {
    return responseData as ApiErrorBody;
  }

  const nested = (responseData as { data?: ApiErrorBody }).data;
  if (nested && typeof nested === 'object') {
    return nested;
  }

  return null;
}

export function isApiErrorResponse(data: unknown): data is ApiErrorBody & {
  success: false;
} {
  return (
    !!data &&
    typeof data === 'object' &&
    (data as ApiErrorBody).success === false
  );
}

export function createApiErrorFromResponse(
  response: NonNullable<AxiosError['response']>,
  config?: AxiosError['config'],
) {
  const data = response.data as ApiErrorBody | undefined;
  const message =
    typeof data?.message === 'string' ? data.message : 'Request failed';

  return new AxiosError(message, AxiosError.ERR_BAD_REQUEST, config, undefined, {
    data,
    status: response.status >= 400 ? response.status : 400,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  });
}

export function getApiErrorCode(error: unknown): string | undefined {
  const code = getApiErrorBody(error)?.code;
  return typeof code === 'string' && code.length > 0 ? code : undefined;
}

export function getApiErrorTranslationKey(code: string) {
  return `apiErrors.${code}`;
}

export function getApiErrorMessage(error: unknown, fallbackKey = 'somethingWentWrong') {
  const body = getApiErrorBody(error);
  const code = body?.code;

  if (code) {
    const translationKey = getApiErrorTranslationKey(code);
    const translated = i18n.t(translationKey);

    if (translated !== translationKey) {
      return translated;
    }
  }

  if (typeof body?.message === 'string' && body.message.trim()) {
    return body.message;
  }

  if (typeof body?.description === 'string' && body.description.trim()) {
    return body.description;
  }

  return i18n.t(fallbackKey);
}

export function showApiErrorToast(
  error: unknown,
  fallbackKey = 'somethingWentWrong',
) {
  Toast.show({
    type: 'error',
    text1: getApiErrorMessage(error, fallbackKey),
  });
}

export function isPublicAuthRequest(url?: string) {
  if (!url) return false;

  return (
    url.includes('/v1/auth/login') ||
    url.includes('/v1/auth/register') ||
    url.includes('/v1/auth/forgot-password') ||
    url.includes('/v1/auth/reset-password')
  );
}

export function isAuthRequest(url?: string) {
  return typeof url === 'string' && url.includes('/v1/auth/');
}
