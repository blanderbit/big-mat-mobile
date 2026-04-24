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

const firebaseConfig = {
  apiKey:
    Platform.OS === 'android' ? FIREBASE_API_KEY_ANDROID : FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: Platform.OS === 'android' ? FIREBASE_APP_ID_ANDROID : FIREBASE_APP_ID,
  databaseURL: FIREBASE_DATABASE_URL,
};

try {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (e) {}
