import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { routes } from '@navigation/extra/routes';

import { Lesson, Topic } from '@extra/types';

export type HomeStackParamList = {
  [routes.home.HOME]: undefined;
  [routes.home.TOPIC]: { topicId: Topic['id'] };
  [routes.home.START_LESSON]: { lesson: Lesson };
  [routes.home.LESSON]: { lessonId: Lesson['id'] };
};

export type AuthStackParamList = {
  [routes.auth.AUTH]: undefined;
};

export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;
