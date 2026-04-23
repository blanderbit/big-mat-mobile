import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Auth } from '@screens/Auth';
import { routes } from '@navigation/extra/routes';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator
    initialRouteName={routes.auth.AUTH}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen component={Auth} name={routes.auth.AUTH} />
  </Stack.Navigator>
);
