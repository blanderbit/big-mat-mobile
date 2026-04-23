import { useSafeAreaInsets } from 'react-native-safe-area-context';
import _Toast from 'react-native-toast-message';

import { config } from '@components/Toast/components/Config';

import { DEFAULT_SPACE } from '@extra/constants';

export const Toast = () => {
  const { top } = useSafeAreaInsets();

  return <_Toast config={config} topOffset={top + DEFAULT_SPACE} />;
};
