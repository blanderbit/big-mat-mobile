import { useState } from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

type Props = {
  isCorrect: boolean;
  text: string;
  onPressNext: () => void;
};

export const AnswerResult = ({ isCorrect, text, onPressNext }: Props) => {
  const windowWidth = Dimensions.get('window').width;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(0));

  const handleLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;

    // start hidden below and slide up
    translateY.setValue(height);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isCorrect ? colors.green : colors.brightOrange,
          width: windowWidth,
          paddingBottom: bottom + DEFAULT_SPACE,
          transform: [{ translateY }],
        },
      ]}
      onLayout={handleLayout}
    >
      <Text center semiBold color={colors.white} size={20}>
        {text}
      </Text>

      <Button
        title={isCorrect ? t('next') : t('continue')}
        onPress={onPressNext}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: DEFAULT_SPACE,
    paddingTop: DEFAULT_SPACE * 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
    gap: DEFAULT_SPACE,
  },
});
