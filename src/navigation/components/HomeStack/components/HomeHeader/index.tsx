import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

import BlankAvatar from '@assets/images/blankAvatar.svg';
import Home from '@assets/images/home.svg';

export const HomeHeader = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + DEFAULT_SPACE }]}>
      <Home height={38} width={33} />

      <View style={styles.right}>
        <BlankAvatar height={42} width={42} />

        <View style={styles.scorePill}>
          <Text bold color={colors.brightPurple} size={20}>
            90
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
