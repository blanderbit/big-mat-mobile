import { Pressable as RNPressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_OPACITY } from '@extra/constants';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  marginTop?: number;
};

export const Button = ({ title, onPress, disabled, marginTop }: Props) => {
  const opacity = disabled ? DEFAULT_OPACITY : 1;

  return (
    <RNPressable
      disabled={disabled}
      style={[styles.pressable, { opacity, marginTop }]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <View style={[styles.shadowWrap, pressed && styles.shadowWrapPressed]}>
          <View style={styles.clipWrap}>
            <LinearGradient
              colors={pressed ? pressedBaseColors : baseColors}
              end={{ x: 0.5, y: 1 }}
              locations={[0, 0.55, 1]}
              pointerEvents="none"
              start={{ x: 0.5, y: 0 }}
              style={styles.baseGradient}
            />

            <LinearGradient
              colors={pressed ? pressedGlossColors : glossColors}
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
      )}
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

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  shadowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
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
    paddingVertical: 16,
    borderRadius: 40,
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
