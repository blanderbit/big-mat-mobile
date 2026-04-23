import { PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  Insets,
  Pressable as RNPressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { DEFAULT_OPACITY } from '@extra/constants';

type Props = PropsWithChildren<{
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hitSlop?: Insets;
}>;

export const Pressable = ({
  children,
  onPress,
  style,
  disabled,
  hitSlop,
}: Props) => {
  const opacity = disabled ? DEFAULT_OPACITY : 1;

  return (
    <RNPressable
      disabled={disabled}
      hitSlop={hitSlop}
      style={[style, { opacity }]}
      onPress={onPress}
    >
      {children}
    </RNPressable>
  );
};
