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
  /** Shrink font so content fits width (one line). */
  adjustsFontSizeToFit?: boolean;
  /** Min scale vs `size` (0–1). Default 0.2 when adjustsFontSizeToFit is true. */
  minimumFontScale?: number;
  numberOfLines?: number;
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
  adjustsFontSizeToFit,
  minimumFontScale,
  numberOfLines,
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
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={
        adjustsFontSizeToFit ? minimumFontScale ?? 0.2 : minimumFontScale
      }
      numberOfLines={numberOfLines}
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
