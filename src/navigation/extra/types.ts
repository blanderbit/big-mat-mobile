import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { routes } from '@navigation/extra/routes';

export type HomeStackParamList = {
  [routes.home.HOME]: undefined;
};

export type AuthStackParamList = {
  [routes.auth.AUTH]: undefined;
};

export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;
