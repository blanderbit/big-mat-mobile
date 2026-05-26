import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';

import {
  FIREBASE_API_KEY,
  FIREBASE_API_KEY_ANDROID,
  FIREBASE_APP_ID,
  FIREBASE_APP_ID_ANDROID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@env';

const trim = (v: string | undefined) => (v || '').trim();

const firebaseConfig = {
  apiKey:
    Platform.OS === 'android'
      ? trim(FIREBASE_API_KEY_ANDROID)
      : trim(FIREBASE_API_KEY),
  authDomain: trim(FIREBASE_AUTH_DOMAIN),
  projectId: trim(FIREBASE_PROJECT_ID),
  storageBucket: trim(FIREBASE_STORAGE_BUCKET),
  messagingSenderId: trim(FIREBASE_MESSAGING_SENDER_ID),
  appId:
    Platform.OS === 'android'
      ? trim(FIREBASE_APP_ID_ANDROID)
      : trim(FIREBASE_APP_ID),
  databaseURL: trim(FIREBASE_DATABASE_URL),
};

const hasValidAndroidEnv =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.appId);

try {
  if (firebase.apps.length === 0) {
    if (Platform.OS === 'ios' || hasValidAndroidEnv) {
      firebase.initializeApp(firebaseConfig);
    }
  }
} catch (e) {}
