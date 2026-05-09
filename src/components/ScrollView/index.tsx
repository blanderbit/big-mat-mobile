import { forwardRef, PropsWithChildren } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  scrollEnabled?: boolean;
}>;

export const ScrollView = forwardRef<RNScrollView, Props>(
  (
    {
      children,
      refreshing,
      onRefresh,
      scrollViewStyle,
      contentContainerStyle,
      onLayout,
      onScroll,
      scrollEventThrottle,
      scrollEnabled,
    },
    ref,
  ) => (
    <RNScrollView
      nestedScrollEnabled
      // не добавлять keyboardDismissMode="on-drag"!
      // keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ref={ref}
      scrollEnabled={scrollEnabled}
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
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      {children}
    </RNScrollView>
  ),
);

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: DEFAULT_SPACE,
  },
  container: {
    paddingHorizontal: DEFAULT_SPACE,
  },
});
