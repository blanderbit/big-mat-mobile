import { createNavigationContainerRef } from '@react-navigation/native';

import type { AppBottomTabParamList } from '@navigation/extra/types';

export const navigationRef =
  createNavigationContainerRef<AppBottomTabParamList>();
