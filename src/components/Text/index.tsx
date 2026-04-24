import { PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextStyle,
} from 'react-native';

import { colors } from '@extra/colors';
import { DEFAULT_FONT_FAMILY } from '@extra/constants';

type Props = PropsWithChildren<{
  color?: string;
  size?: number;
  bold?: boolean;
  semiBold?: boolean;
  marginBottom?: number;
  marginTop?: number;
  center?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  uppercase?: boolean;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<TextStyle>;
}>;

export const Text = ({
  children,
  color,
  size,
  bold,
  semiBold,
  marginBottom,
  marginTop,
  center,
  onPress,
  uppercase,
  onLongPress,
  style,
}: Props) => {
  // TODO: add real font from design
  const fontFamily = semiBold
    ? 'Unbounded-SemiBold'
    : bold
    ? 'Unbounded-Bold'
    : DEFAULT_FONT_FAMILY;

  const textAlign = center ? 'center' : 'left';
  const textDecorationLine = onPress ? 'underline' : 'none';
  const textTransform = uppercase ? 'uppercase' : 'none';

  return (
    <RNText
      style={[
        styles.text,
        {
          color: color || colors.black,
          fontSize: size || 16,
          fontFamily,
          marginBottom: marginBottom || 0,
          marginTop: marginTop || 0,
          textAlign,
          textDecorationLine,
          textTransform,
        },
        style,
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
});
