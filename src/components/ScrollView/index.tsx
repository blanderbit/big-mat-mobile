import { PropsWithChildren } from 'react';
import {
  LayoutChangeEvent,
  RefreshControl,
  ScrollView as RNScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { DEFAULT_SPACE } from '@extra/constants';

type Props = PropsWithChildren<{
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollViewStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

export const ScrollView = ({
  children,
  refreshing,
  onRefresh,
  scrollViewStyle,
  contentContainerStyle,
  onLayout,
}: Props) => (
  <RNScrollView
    nestedScrollEnabled
    // не добавлять keyboardDismissMode="on-drag"!
    // keyboardDismissMode="on-drag"
    keyboardShouldPersistTaps="handled"
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    style={[styles.container, scrollViewStyle]}
    contentContainerStyle={[
      styles.contentContainerStyle,
      contentContainerStyle,
    ]}
    refreshControl={
      onRefresh ? (
        <RefreshControl
          refreshing={refreshing ?? false}
          onRefresh={onRefresh}
        />
      ) : undefined
    }
    onLayout={onLayout}
  >
    {children}
  </RNScrollView>
);

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: DEFAULT_SPACE,
  },
  container: {
    paddingHorizontal: DEFAULT_SPACE,
  },
});
