import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uk from '@localization/extra/locales/uk.json';
import { useSettingsStore } from '@stores/settingsStore';

const resources = {
  uk,
};

export const initializeI18nLocalization = async () => {
  const appLanguage = useSettingsStore.getState().appLanguage;

  await i18n.use(initReactI18next).init({
    lng: appLanguage,
    fallbackLng: 'uk',
    debug: true,
    resources,
    react: {
      useSuspense: false,
    },
  });
};
