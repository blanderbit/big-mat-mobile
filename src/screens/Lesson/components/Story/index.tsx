import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';

import Background12 from '@assets/images/background12.svg';
import Notch2 from '@assets/images/notch2.svg';

type Props = {
  slide: Slide<SlideType.STORY>;
};

export const Story = ({ slide }: Props) => {
  console.log('Story slide', slide.variants[0]);
  const [containerWidth, setContainerWidth] = useState(0);
  const { t } = useTranslation();
  const handleSetContainerWidth = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container} onLayout={handleSetContainerWidth}>
      <View
        style={[
          styles.textBubble,
          { width: containerWidth + DEFAULT_SPACE * 2 },
        ]}
      >
        <Text center size={20}>
          {slide.variants[0].text.content[0].content[0].text}
        </Text>

        <View style={styles.notchWrap}>
          <Notch2 />
        </View>
      </View>

      <View
        style={[styles.nextButtonWrap, { bottom }]}
      >
        <Button
          title={slide.variants[0].buttonText || t('next')}
          onPress={() => {}}
        />
      </View>

      <View style={styles.background}>
        <Background12 width="100%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBubble: {
    position: 'absolute',
    top: -DEFAULT_SPACE,
    left: -DEFAULT_SPACE,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    paddingHorizontal: DEFAULT_SPACE * 2,
    paddingVertical: DEFAULT_SPACE * 2,
  },
  notchWrap: {
    position: 'absolute',
    bottom: -38,
    left: DEFAULT_SPACE * 2,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: DEFAULT_SPACE,
    zIndex: 2,
  },
  background: {
    position: 'absolute',
    right: -DEFAULT_SPACE,
    bottom: -DEFAULT_SPACE,
    width: '100%',
  },
});
