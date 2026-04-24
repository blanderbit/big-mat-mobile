import { forwardRef, PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
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
  onStartShouldSetResponder?: () => boolean;
}>;

export const KeyboardAvoidingScrollView = forwardRef<ScrollView, Props>(
  (
    {
      children,
      refreshing,
      onRefresh,
      scrollViewStyle,
      contentContainerStyle,
      onStartShouldSetResponder,
    },
    ref,
  ) => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      onStartShouldSetResponder={onStartShouldSetResponder}
    >
      <ScrollView
        nestedScrollEnabled
        // не добавлять keyboardDismissMode="on-drag"!
        // keyboardDismissMode="on-drag"
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        ref={ref}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.container, scrollViewStyle]}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing ?? false}
              onRefresh={onRefresh}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  ),
);

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: DEFAULT_SPACE,
  },
});
