import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { SlideQuestion } from '@screens/Lesson/components/Question';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

import Background12 from '@assets/images/background12.svg';
import Notch2 from '@assets/images/notch2.svg';

type Props = {
  slide: Slide<SlideType.STORY>;
  lessonId: string;
};

export const Story = ({ slide, lessonId }: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [textBubbleY, setTextBubbleY] = useState<number | null>(null);
  const [notchBottom, setNotchBottom] = useState<number | null>(null);
  const [buttonTop, setButtonTop] = useState<number | null>(null);
  const { t } = useTranslation();
  const handleSetContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
    setContainerHeight(event.nativeEvent.layout.height);
  };
  const { bottom } = useSafeAreaInsets();

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect: true,
    lessonId,
    slideId: slide.id,
  });

  const getImagePositionStyle = () => {
    switch (slide.variants[0].imagePosition) {
      case 'top':
        return { justifyContent: 'flex-start' };
      case 'inline':
        return { justifyContent: 'center' };
      case 'bottom':
        return { justifyContent: 'flex-end' };
      default:
        return { justifyContent: 'center' };
    }
  };

  const imagePositionStyle = getImagePositionStyle() as ViewStyle;

  return (
    <View style={styles.container} onLayout={handleSetContainerLayout}>
      <View
        style={[
          styles.textBubble,
          { width: containerWidth + DEFAULT_SPACE * 2 },
        ]}
        onLayout={e => {
          const { y } = e.nativeEvent.layout;
          setTextBubbleY(y);
        }}
      >
        <SlideQuestion
          text={slide.variants[0].text.content[0].content[0].text}
        />

        <View
          style={styles.notchWrap}
          onLayout={e => {
            const { y, height } = e.nativeEvent.layout;
            if (textBubbleY == null) return;
            setNotchBottom(textBubbleY + y + height);
          }}
        >
          <Notch2 />
        </View>
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.betweenDebug,
          notchBottom != null && buttonTop != null && containerHeight > 0
            ? {
                top: notchBottom,
                bottom: Math.max(0, containerHeight - buttonTop),
              }
            : null,
          imagePositionStyle,
        ]}
      >
        <FastImage
          resizeMode={slide.variants[0].imageFit}
          source={{ uri: slide.variants[0].imageUrl }}
          style={{
            width: slide.variants[0].imageWidth,
            height: slide.variants[0].imageHeight,
          }}
        />
      </View>

      <View
        style={[styles.nextButtonWrap, { bottom }]}
        onLayout={e => {
          setButtonTop(e.nativeEvent.layout.y);
        }}
      >
        <Button
          disabled={isLoading}
          isLoading={isLoading}
          title={slide.variants[0].buttonText || t('next')}
          onPress={handleGoToNextSlide}
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
    zIndex: 2,
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
  betweenDebug: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    right: -DEFAULT_SPACE,
    bottom: -DEFAULT_SPACE,
    width: '100%',
  },
});
