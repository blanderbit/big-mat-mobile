import { ReactNode, useState } from 'react';
import {
  DimensionValue,
  LayoutChangeEvent,
  Pressable as RNPressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

export const DEFAULT_HEIGHT = 60;
/** ~line height for title `size={22}` — content taller ⇒ multiline. */
const SINGLE_LINE_CONTENT_HEIGHT = 30;

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
  const [isMultiline, setIsMultiline] = useState(false);
  const radius = borderRadius ?? 40;
  const isGray = disabled;
  const isFixedSizeButton = size != null;

  const handleContentLayout = (event: LayoutChangeEvent) => {
    if (isFixedSizeButton) return;
    const { height } = event.nativeEvent.layout;
    const next = height > SINGLE_LINE_CONTENT_HEIGHT;
    setIsMultiline(prev => (prev === next ? prev : next));
  };

  const usesContentHeight = !isFixedSizeButton && isMultiline;

  let clipLayoutStyle: ViewStyle;
  if (isFixedSizeButton) {
    clipLayoutStyle = { height: size, width: '100%' };
  } else if (usesContentHeight) {
    clipLayoutStyle = {
      minHeight: DEFAULT_HEIGHT,
      paddingVertical: DEFAULT_SPACE,
      paddingHorizontal: DEFAULT_SPACE,
    };
  } else {
    clipLayoutStyle = { height: DEFAULT_HEIGHT };
  }

  const pressableStyle = [
    styles.pressable,
    {
      width: width ?? size ?? '100%',
      marginTop,
      marginVertical,
      marginBottom,
    },
    isFixedSizeButton
      ? { height: size, width: size }
      : usesContentHeight
      ? { minHeight: DEFAULT_HEIGHT }
      : { height: DEFAULT_HEIGHT },
  ];

  const shadowRadiusStyle = { borderRadius: radius };

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
            <View
              style={[
                styles.clipWrap,
                { borderRadius: radius },
                clipLayoutStyle,
              ]}
            >
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
              ) : (
                <View
                  style={styles.contentMeasure}
                  onLayout={
                    !isFixedSizeButton ? handleContentLayout : undefined
                  }
                >
                  {children ? (
                    children
                  ) : (
                    <Text bold center size={22} style={styles.title}>
                      {title}
                    </Text>
                  )}
                </View>
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
  pressable: {},
  contentMeasure: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: '100%',
  },
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
