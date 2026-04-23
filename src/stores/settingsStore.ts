import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsStore = {
  appLanguage: string;
  setAppLanguage: (appLanguage: string) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      appLanguage: 'uk',

      setAppLanguage: (appLanguage: string) => set({ appLanguage }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
