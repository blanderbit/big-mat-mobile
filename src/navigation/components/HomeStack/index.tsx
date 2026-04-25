import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '@screens/Home';
import { Lesson } from '@screens/Lesson';
import { StartLesson } from '@screens/StartLesson';
import { Topic } from '@screens/Topic';
import { HomeHeader } from '@navigation/components/HomeStack/components/HomeHeader';
import { LessonHeader } from '@navigation/components/HomeStack/components/LessonHeader';
import { routes } from '@navigation/extra/routes';
import { HomeStackParamList } from '@navigation/extra/types';

import { colors } from '@extra/colors';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator
    initialRouteName={routes.home.HOME}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen
      component={Home}
      name={routes.home.HOME}
      options={{
        headerShown: true,
        header: HomeHeader,
        contentStyle: { backgroundColor: colors.pink },
      }}
    />
    <Stack.Screen
      component={Topic}
      name={routes.home.TOPIC}
      options={{
        headerShown: true,
        header: HomeHeader,
        contentStyle: { backgroundColor: colors.brightPurple },
      }}
    />
    <Stack.Screen
      component={StartLesson}
      name={routes.home.START_LESSON}
      options={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.brightPurple },
      }}
    />
    <Stack.Screen
      component={Lesson}
      name={routes.home.LESSON}
      options={{
        headerShown: true,
        header: LessonHeader,
        contentStyle: { backgroundColor: colors.pink },
      }}
    />
  </Stack.Navigator>
);
