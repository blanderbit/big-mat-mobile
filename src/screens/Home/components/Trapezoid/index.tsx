import { Image, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Topic } from '@extra/types';

import lock from '@assets/images/lock.png';

export const Trapezoid = ({
  title,
  locked,
  isLast,
}: Topic & { isLast: boolean }) => {
  return (
    <View style={styles.trapezoidContainer}>
      <Svg fill="none" height="140" viewBox="0 0 347 140" width="100%">
        <Path
          d="M33.3647 0.5L313.191 0.499999C332.355 0.500225 347.454 16.8321 345.953 35.9375L340.196 109.211C338.852 126.31 324.585 139.5 307.433 139.5L39.1226 139.5C21.9711 139.5 7.70334 126.31 6.35986 109.211L0.603027 35.9375C-0.898115 16.8321 14.2005 0.500206 33.3647 0.5Z"
          fill={locked ? colors.white : colors.darkPurple}
          stroke={colors.black}
        />
      </Svg>

      <View
        style={[
          styles.trapezoidContent,
          !isLast && styles.trapezoidContentNotLast,
        ]}
      >
        {locked && (
          <Image resizeMode="contain" source={lock} style={styles.lockIcon} />
        )}

        <Text
          bold
          center={!locked}
          color={locked ? colors.black : colors.white}
          size={18}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trapezoidContainer: {
    marginTop: -DEFAULT_SPACE,
  },
  trapezoidContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: DEFAULT_SPACE,
    paddingHorizontal: DEFAULT_SPACE,
    paddingBottom: 0,
  },
  trapezoidContentNotLast: {
    paddingBottom: DEFAULT_SPACE,
  },
  lockIcon: {
    width: 40,
  },
});
