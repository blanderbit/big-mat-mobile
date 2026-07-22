import { AxiosResponse } from 'axios';

import { API } from '@API/index';
import { getAuthPlatform } from '@extra/getAuthPlatform';
import { User } from '@extra/types';

export type LocalAuthResponse = {
  token: string;
  user: User;
  authKind: 'local';
};

export type ForgotPasswordResponse = {
  sent: true;
};

export type ResetPasswordResponse = {
  ok: true;
};

export function extractLocalAuthResponse(
  response: AxiosResponse,
): LocalAuthResponse | null {
  const body = response.data as Record<string, unknown> | null;
  if (!body) return null;

  if (typeof body.token === 'string') {
    return body as LocalAuthResponse;
  }

  const nested = body.data as Record<string, unknown> | undefined;
  if (nested && typeof nested.token === 'string') {
    return nested as LocalAuthResponse;
  }

  return null;
}

export const authApi = {
  register: (payload: { email: string; password: string; name?: string }) =>
    API.post<LocalAuthResponse>('/v1/auth/register', {
      ...payload,
      platform: getAuthPlatform(),
    }),

  login: (payload: { email: string; password: string }) =>
    API.post<LocalAuthResponse>('/v1/auth/login', {
      ...payload,
      platform: getAuthPlatform(),
    }),

  forgotPassword: (payload: { email: string }) =>
    API.post<ForgotPasswordResponse>('/v1/auth/forgot-password', payload),

  resetPassword: (payload: {
    email: string;
    code: string;
    password: string;
  }) => API.post<ResetPasswordResponse>('/v1/auth/reset-password', payload),
};
