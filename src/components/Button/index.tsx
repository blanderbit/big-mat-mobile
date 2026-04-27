import { Pressable as RNPressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_OPACITY, DEFAULT_SPACE } from '@extra/constants';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  marginTop?: number;
  borderRadius?: number;
  size?: number;
  pressed?: boolean;
};

export const Button = ({
  title,
  onPress,
  disabled,
  marginTop,
  borderRadius,
  size,
  pressed: forcedPressed,
}: Props) => {
  const opacity = disabled ? DEFAULT_OPACITY : 1;
  const radius = borderRadius ?? 40;
  const isGray = disabled;
  const pressableStyle = [
    styles.pressable,
    {
      width: size ?? '100%',
      ...(size ? { height: size } : null),
      opacity,
      marginTop,
    },
  ];

  const shadowRadiusStyle = { borderRadius: radius };
  const clipRadiusStyle = {
    borderRadius: radius,
    paddingVertical: size ? 0 : DEFAULT_SPACE,
    ...(size ? { height: size } : null),
  };

  return (
    <RNPressable disabled={disabled} style={pressableStyle} onPress={onPress}>
      {({ pressed }) => {
        const isPressed = forcedPressed === true || pressed;
        const base = isGray ? grayBaseColors : baseColors;
        const pressedBase = isGray ? grayPressedBaseColors : pressedBaseColors;
        const gloss = isGray ? grayGlossColors : glossColors;
        const pressedGloss = isGray ? grayPressedGlossColors : pressedGlossColors;

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

              <Text bold size={22}>
                {title}
              </Text>
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
  pressable: {},
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
