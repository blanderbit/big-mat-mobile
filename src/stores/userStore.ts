import { create } from 'zustand';

import { API } from '@API/index';
import { User } from '@extra/types';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@keychain/extra/constants';
import { keychain } from '@keychain/index';

interface UserStore {
  user: User | null;
  getUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  getUser: async () => {
    const accessToken = await keychain.getItem(ACCESS_TOKEN);
    if (accessToken) {
      // const userResponse = await API.get(endpoints.PROFILE);
      // set({ user: userResponse.data });
    }
  },
  logout: async () => {
    set({ user: null });
    await keychain.removeItem(ACCESS_TOKEN);
    await keychain.removeItem(REFRESH_TOKEN);
  },
}));
