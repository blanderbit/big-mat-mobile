import { ReactNode } from 'react';
import {
  DimensionValue,
  Pressable as RNPressable,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';

type Props = {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  marginTop?: number;
  borderRadius?: number;
  size?: number;
  pressed?: boolean;
  marginVertical?: number;
  marginBottom?: number;
  isLoading?: boolean;
  children?: ReactNode;
  width?: DimensionValue;
};

export const Button = ({
  title,
  onPress,
  disabled,
  marginTop,
  borderRadius,
  size,
  pressed: forcedPressed,
  marginVertical,
  marginBottom,
  isLoading,
  children,
  width,
}: Props) => {
  const DEFAULT_HEIGHT = 60;
  const radius = borderRadius ?? 40;
  const isGray = disabled;
  const pressableStyle = [
    styles.pressable,
    {
      width: width ?? size ?? '100%',
      height: size ?? DEFAULT_HEIGHT,
      marginTop,
      marginVertical,
      marginBottom,
    },
  ];

  const shadowRadiusStyle = { borderRadius: radius };
  const clipRadiusStyle = {
    borderRadius: radius,
    height: size ?? DEFAULT_HEIGHT,
  };

  return (
    <RNPressable disabled={disabled} style={pressableStyle} onPress={onPress}>
      {({ pressed }) => {
        const isPressed = forcedPressed === true || pressed;
        const base = isGray ? grayBaseColors : baseColors;
        const pressedBase = isGray ? grayPressedBaseColors : pressedBaseColors;
        const gloss = isGray ? grayGlossColors : glossColors;
        const pressedGloss = isGray
          ? grayPressedGlossColors
          : pressedGlossColors;

        return (
          <View
            style={[
              styles.shadowWrap,
              isPressed && styles.shadowWrapPressed,
              shadowRadiusStyle,
            ]}
          >
            <View style={[styles.clipWrap, clipRadiusStyle]}>
              <LinearGradient
                colors={isPressed ? pressedBase : base}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 0.55, 1]}
                pointerEvents="none"
                start={{ x: 0.5, y: 0 }}
                style={styles.baseGradient}
              />

              <LinearGradient
                colors={isPressed ? pressedGloss : gloss}
                end={{ x: 0.5, y: 1 }}
                pointerEvents="none"
                start={{ x: 0.5, y: 0 }}
                style={styles.glossGradient}
              />

              {isLoading ? (
                <ActivityIndicator color={colors.black} size="small" />
              ) : children ? (
                children
              ) : (
                <Text bold size={22}>
                  {title}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    </RNPressable>
  );
};

const baseColors: string[] = ['#F8FB86', '#F1F458', '#DADA40'];
const pressedBaseColors: string[] = ['#D6D647', '#E6E63A', '#BDBD2D'];
const glossColors: string[] = ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'];
const pressedGlossColors = [
  'rgba(255,255,255,0.18)',
  'rgba(255,255,255,0)',
] satisfies string[];

const grayBaseColors: string[] = ['#F2F2F2', '#DADADA', '#BEBEBE'];
const grayPressedBaseColors: string[] = ['#D9D9D9', '#CFCFCF', '#B5B5B5'];
const grayGlossColors: string[] = [
  'rgba(255,255,255,0.55)',
  'rgba(255,255,255,0)',
];
const grayPressedGlossColors = [
  'rgba(255,255,255,0.18)',
  'rgba(255,255,255,0)',
] satisfies string[];

const styles = StyleSheet.create({
  pressable: { height: 60 },
  shadowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  shadowWrapPressed: {
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    transform: [{ scale: 0.99 }],
  },
  clipWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.black,
    overflow: 'hidden',
    width: '100%',
  },
  baseGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  glossGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
});
