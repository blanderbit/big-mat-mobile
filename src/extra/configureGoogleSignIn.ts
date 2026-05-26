import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';

// From android/app/google-services.json & GoogleService-Info.plist (bigmat-main).
export const GOOGLE_WEB_CLIENT_ID_FALLBACK =
  '922387615875-0l4li57e92fdbmvr37577fh9gcg18rcv.apps.googleusercontent.com';

export const GOOGLE_IOS_CLIENT_ID_FALLBACK =
  '922387615875-kmb9e51dabhgjl1skl29f2sql97bc644.apps.googleusercontent.com';

const getWebClientId = () =>
  (GOOGLE_WEB_CLIENT_ID || '').trim() || GOOGLE_WEB_CLIENT_ID_FALLBACK;

const getIosClientId = () =>
  (GOOGLE_IOS_CLIENT_ID || '').trim() || GOOGLE_IOS_CLIENT_ID_FALLBACK;

let isConfigured = false;

export const configureGoogleSignIn = () => {
  if (isConfigured) return;

  const webClientId = getWebClientId();

  if (Platform.OS === 'ios') {
    GoogleSignin.configure({
      iosClientId: getIosClientId(),
      webClientId,
    });
  } else {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
    });
  }

  isConfigured = true;
};
