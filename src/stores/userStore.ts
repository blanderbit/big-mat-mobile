import { create } from 'zustand';

import { API } from '@API/index';
import { User } from '@extra/types';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@keychain/extra/constants';
import { keychain } from '@keychain/index';

interface UserStore {
  user: User | null;
  totalScore: number;
  getTotalScore: () => Promise<void>;
  getUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  totalScore: 0,
  getUser: async () => {
    const accessToken = await keychain.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const userResponse = await API.get('/v1/auth/me');
      set({ user: userResponse.data });
      await get().getTotalScore();
    }
  },
  getTotalScore: async () => {
    const totalScoreResponse = await API.get('/v1/progress/score');
    set({ totalScore: totalScoreResponse.data.data.totalScore });
  },
  logout: async () => {
    set({ user: null, totalScore: 0 });
    await keychain.removeItem(ACCESS_TOKEN);
    await keychain.removeItem(REFRESH_TOKEN);
  },
}));
