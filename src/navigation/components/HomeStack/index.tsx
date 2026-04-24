import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '@screens/Home';
import { Topic } from '@screens/Topic';
import { HomeHeader } from '@navigation/components/HomeStack/components/HomeHeader';
import { routes } from '@navigation/extra/routes';

import { colors } from '@extra/colors';

const Stack = createNativeStackNavigator();

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
  </Stack.Navigator>
);
