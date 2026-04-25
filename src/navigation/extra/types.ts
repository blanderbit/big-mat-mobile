import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { routes } from '@navigation/extra/routes';

import { Topic } from '@extra/types';

export type HomeStackParamList = {
  [routes.home.HOME]: undefined;
  [routes.home.TOPIC]: { lessons: Topic['routes'] };
  [routes.home.START_LESSON]: { lesson: Topic['routes'][number] };
  [routes.home.LESSON]: { lessonId: Topic['routes'][number]['id'] };
};

export type AuthStackParamList = {
  [routes.auth.AUTH]: undefined;
};

export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;
