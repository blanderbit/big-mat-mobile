import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

type Props = {
  children: ReactNode;
  backgroundColor?: string;
};

export const Wrapper = ({ children, backgroundColor }: Props) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom + DEFAULT_SPACE, backgroundColor },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    // paddingTop: DEFAULT_SPACE * 2,
    paddingHorizontal: DEFAULT_SPACE,
    marginHorizontal: -DEFAULT_SPACE,
    gap: DEFAULT_SPACE,
    flex: 1,
    marginBottom: -DEFAULT_SPACE,
  },
});
