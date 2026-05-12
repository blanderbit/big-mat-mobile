import { StyleSheet, View } from 'react-native';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

const RADIUS = 45;
const HEIGHT = 20;

type Props = {
  value: number;
  marginTop?: number;
  marginHorizontal?: number;
  tooltipText?: string;
  marginBottom?: number;
  trackColor?: string;
  fillColor?: string;
};

export const RoundSlider = ({
  value,
  marginTop,
  marginHorizontal,
  tooltipText,
  marginBottom,
  trackColor,
  fillColor,
}: Props) => {
  const progress = value / 100;

  return (
    <View
      style={[
        marginTop != null ? { marginTop } : null,
        marginHorizontal != null ? { marginHorizontal } : null,
        marginBottom != null ? { marginBottom } : null,
      ]}
    >
      <View
        style={[
          styles.track,
          { backgroundColor: trackColor ?? colors.darkBlue },
        ]}
      />

      <View
        style={[
          styles.fill,
          {
            width: `${progress * 100}%`,
            backgroundColor: fillColor ?? colors.white,
          },
        ]}
      />

      {tooltipText ? (
        <View pointerEvents="none" style={styles.tooltipWrapper}>
          <View style={styles.tooltipNotch} />

          <View style={styles.tooltipBubble}>
            <Text bold color={colors.black} size={18}>
              {tooltipText}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: HEIGHT,
    borderRadius: RADIUS,
  },
  fill: {
    height: HEIGHT,
    borderRadius: RADIUS,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  tooltipWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },
  tooltipNotch: {
    width: 16,
    height: 16,
    backgroundColor: colors.brightYellow,
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
    marginBottom: -8,
    zIndex: 1,
  },
  tooltipBubble: {
    backgroundColor: colors.brightYellow,
    borderRadius: 18,
    paddingHorizontal: DEFAULT_SPACE,
    paddingVertical: 6,
  },
});
