import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Toast } from '@components/Toast';
import { Navigation } from '@navigation/index';

import { initializeI18nLocalization } from '@localization/index';
import { useUserStore } from '@stores/userStore';

// import { initCalendarLocales } from '@extra/initCalendarLocales';
// import { initializeI18nLocalization } from '@localization/index';
// import 'dayjs/locale/uk';
import '@API/extra/interceptors';
import '@extra/hideLogs';
import '@extra/firebaseInitialize';
import 'react-native-get-random-values';

const App = () => (
  <SafeAreaProvider>
    <AppContent />
  </SafeAreaProvider>
);

function AppContent() {
  const getUser = useUserStore(s => s.getUser);
  const [isLoading, setIsLoading] = useState(true);
  const { top, bottom } = useSafeAreaInsets();
  const [isAppReadyToBeRendered, setIsAppReadyToBeRendered] = useState(false);
  // const logOut = useUserStore(s => s.logout);

  // useEffect(() => {
  //   logOut();
  // }, []);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        await getUser();
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    getUserProfile();
  }, [getUser]);

  const setLocales = async () => {
    // TODO: add another locales in future
    await initializeI18nLocalization();
    // dayjs.locale('uk');
    // initCalendarLocales();
  };

  useEffect(() => {
    (async () => {
      try {
        await setLocales();
      } catch (error) {
        throw error;
      } finally {
        setIsAppReadyToBeRendered(true);
      }
    })();
  }, []);

  return isAppReadyToBeRendered ? (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {isLoading ? (
        <View
          style={[
            styles.activityIndicatorContainer,
            {
              paddingTop: top,
              paddingBottom: bottom,
            },
          ]}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <Navigation />

          <Toast />
        </>
      )}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
