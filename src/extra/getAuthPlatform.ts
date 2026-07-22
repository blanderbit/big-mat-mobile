import { Platform } from 'react-native';

export type AuthPlatform =
  | 'ios'
  | 'android'
  | 'web'
  | 'macos'
  | 'windows'
  | 'other';

const KNOWN_PLATFORMS = new Set<AuthPlatform>([
  'ios',
  'android',
  'web',
  'macos',
  'windows',
  'other',
]);

/** Maps RN Platform.OS to backend auth platform values. */
export function getAuthPlatform(): AuthPlatform {
  const os = Platform.OS;

  if (KNOWN_PLATFORMS.has(os as AuthPlatform)) {
    return os as AuthPlatform;
  }

  return 'other';
}
