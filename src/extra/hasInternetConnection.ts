import { fetch } from '@react-native-community/netinfo';
import i18n from 'i18next';
import Toast from 'react-native-toast-message';

const showNoInternetToast = () => {
  Toast.show({
    type: 'error',
    text1: i18n.t('noInternetConnection'),
  });
};

export const hasInternetConnection = () =>
  fetch().then(state => {
    if (!state.isConnected) {
      showNoInternetToast();
      return false;
    }
    return true;
  });
