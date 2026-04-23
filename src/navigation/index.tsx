import { NavigationContainer } from '@react-navigation/native';

import { AuthStack } from '@navigation/components/AuthStack';
import { navigationRef } from '@navigation/extra/navigationRef';

import { useUserStore } from '@stores/userStore';

export const Navigation = () => {
  const user = useUserStore(s => s.user);

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? null : <AuthStack />}
    </NavigationContainer>
  );
};
