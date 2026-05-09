import { StyleSheet, View } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';
import { routes } from '@navigation/extra/routes';
import { HomeStackNavigationProp } from '@navigation/extra/types';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { useUserStore } from '@stores/userStore';

import BlankAvatar from '@assets/images/blankAvatar.svg';
import Home from '@assets/images/home.svg';

export const HomeHeader = ({ navigation, route }: NativeStackHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const totalScore = useUserStore(s => s.totalScore);
  const isHome = route.name === routes.home.HOME;

  const handlePressHome = () => {
    if (isHome) return;
    (navigation as unknown as HomeStackNavigationProp).navigate(
      routes.home.HOME,
    );
  };

  return (
    <View style={[styles.container, { paddingTop: top + DEFAULT_SPACE }]}>
      <Pressable
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={handlePressHome}
      >
        <Home height={38} width={33} />
      </Pressable>

      <View style={styles.right}>
        <BlankAvatar height={42} width={42} />

        <View style={styles.scorePill}>
          <Text bold color={colors.brightPurple} size={20}>
            {totalScore}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DEFAULT_SPACE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: DEFAULT_SPACE,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scorePill: {
    backgroundColor: colors.white,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 4,
    paddingLeft: 14,
    marginLeft: -12,
    zIndex: -1,
  },
});
