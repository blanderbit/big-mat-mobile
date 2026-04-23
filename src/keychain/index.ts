import * as Keychain from 'react-native-keychain';

export const keychain = {
  setItem: async (key: string, value: string) => {
    await Keychain.setGenericPassword(key, value, { service: key });
  },
  getItem: async (key: string) => {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (credentials) return credentials.password;
    return null;
  },
  removeItem: async (key: string) => {
    await Keychain.resetGenericPassword({ service: key });
    return true;
  },
  hasItem: async (key: string) => {
    const credentials = await Keychain.getGenericPassword({ service: key });
    return !!credentials;
  },
};
