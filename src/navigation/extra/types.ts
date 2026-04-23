import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { routes } from '@navigation/extra/routes';

import { Board, Coupon, Question, Task } from '@extra/types';

export type HomeStackParamList = {
  [routes.tabs.home.HOME]: undefined;
  [routes.tabs.home.COUPONS]: undefined;
  [routes.tabs.home.CREATE_OR_EDIT_COUPON_SCREEN]:
    | {
        coupon?: Coupon;
      }
    | undefined;
  [routes.tabs.home.ASSIGN_COUPON_TO_CLIENT_SCREEN]: {
    coupon: Coupon;
  };
  [routes.tabs.home.COUPON_DETAILS_SCREEN]: {
    coupon: Coupon;
  };
  [routes.tabs.home.BOARDS_SCREEN]: undefined;
  [routes.tabs.home.RENAME_BOARD_SCREEN]: {
    board: Board;
  };
  [routes.tabs.home.CREATE_BOARD_SCREEN]: undefined;
  [routes.tabs.home.BOARD_SCREEN]: {
    boardId: number;
  };
  [routes.tabs.home.ADD_OR_EDIT_TASK_SCREEN]: {
    columnId: number;
    task?: Task;
  };
  [routes.tabs.home.ADD_COLUMN_SCREEN]: {
    board: Board;
  };
  [routes.tabs.home.QUESTIONS_SCREEN]: undefined;
  [routes.tabs.home.QUESTIONS_OF_CLIENTS_SCREEN]: undefined;
  [routes.tabs.home.QUESTIONS_OF_SERVICES_SCREEN]: undefined;
  [routes.tabs.home.QUESTION_SCREEN]: {
    question: Question;
  };
  [routes.tabs.home.MY_QUESTIONS_SCREEN]: undefined;
  [routes.tabs.home.ARCHIVED_QUESTIONS_SCREEN]: undefined;
  [routes.tabs.home.CREATE_QUESTION_SCREEN]: undefined;
  [routes.tabs.home.MY_AUTOSELECTION_REQUESTS_SCREEN]: undefined;
  [routes.tabs.home.CHATS_SCREEN]: undefined;
  [routes.tabs.home.CREATE_REQUEST_SCREEN]: undefined;
  [routes.tabs.home.SEND_OFFER_SCREEN]: {
    requestId: string | number;
  };
};

export type SettingsStackParamList = {
  [routes.tabs.settings.SETTINGS]: undefined;
  [routes.tabs.settings.MY_SERVICES]: undefined;
  [routes.tabs.settings.ADD_SERVICES]: undefined;
  [routes.tabs.settings.SUBSCRIPTION]: undefined;
  [routes.tabs.settings.ADD_CARD]: undefined;
  [routes.tabs.settings.REFERRAL_PROGRAM]: undefined;
  [routes.tabs.settings.NOTIFICATIONS]: undefined;
};

export type AppBottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList> | undefined;
};

export type AppBottomTabNavigationProp =
  BottomTabNavigationProp<AppBottomTabParamList>;

export type AuthStackParamList = {
  [routes.auth.SIGN_IN]: undefined;
  [routes.auth.SIGN_UP]: undefined;
};

export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;
