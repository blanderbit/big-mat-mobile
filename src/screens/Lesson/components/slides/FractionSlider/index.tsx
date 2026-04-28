import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';

import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Text } from '@components/Text';
import { AnswerResult } from '@screens/Lesson/components/AnswerResult';
import { SlideQuestion } from '@screens/Lesson/components/Question';
import { Wrapper } from '@screens/Lesson/components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { useLessonsStore } from '@stores/lessonsStore';

import SliderToggler from '@assets/images/sliderToggler.svg';
import transparent48x48 from '@assets/images/transparent48x48.png';

type Props = {
  slide: Slide<SlideType.FRACTION_SLIDER>;
  setScrollEnabled?: (enabled: boolean) => void;
};

export const FractionSlider = ({ setScrollEnabled, slide }: Props) => {
  console.log('FractionSlider slide', slide);
  const options = slide.variants[0].options;
  const maxIndex = Math.max(0, options.length - 1);
  const [index, setIndex] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const transparentThumb = Image.resolveAssetSource(transparent48x48);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const goToNextSlide = useLessonsStore(state => state.goToNextSlide);
  const { t } = useTranslation();

  const answerId = options[index].id;
  const dragDisabled = isCorrect != null;

  const answer = async () => {
    //   await API.post(`/v1/content/routes/${lessonId}/answer`, {
    //     answer: slide.variants[0].answer,
    //   });
    const correctIds = slide.variants[0].correctOptionIds;
    const chosenIds = [answerId];

    setIsCorrect(
      chosenIds.length === correctIds.length &&
        chosenIds.every(id => correctIds.includes(id)) &&
        correctIds.every(id => chosenIds.includes(id)),
    );
  };

  const progress = maxIndex === 0 ? 0 : index / maxIndex;
  const TOGGLER_SIZE = 48;
  const TRACK_HEIGHT = 16;
  const togglerLeft =
    sliderWidth > 0
      ? Math.max(
          0,
          Math.min(
            sliderWidth - TOGGLER_SIZE,
            progress * (sliderWidth - TOGGLER_SIZE),
          ),
        )
      : 0;

  const setIndexByX = (x: number) => {
    if (dragDisabled) return;
    if (maxIndex <= 0 || sliderWidth <= 0) {
      setIndex(0);
      return;
    }

    const clamped = Math.max(0, Math.min(sliderWidth, x));
    const next = Math.round((clamped / sliderWidth) * maxIndex);
    setIndex(Math.max(0, Math.min(maxIndex, next)));
  };

  const startDrag = (x: number) => {
    if (dragDisabled) return;
    setScrollEnabled?.(false);
    setIndexByX(x);
  };

  const endDrag = () => {
    setScrollEnabled?.(true);
  };

  return (
    <Wrapper>
      <SlideQuestion
        text={slide.variants[0].questionText.content[0].content[0].text}
      />

      {slide.variants[0].questionImageUrl && (
        <FullWidthFastImage uri={slide.variants[0].questionImageUrl} />
      )}

      <View style={styles.labelsRow}>
        {options.map((opt, i) => {
          const isActive = i === index;
          const parsedLabel = opt.label.split('/');
          const color = isActive ? colors.black : colors.darkGrey;

          return (
            <View key={opt.id}>
              <Text center bold={isActive} color={color} size={22}>
                {parsedLabel[0]}
              </Text>

              <View
                style={[styles.labelDivider, { borderBottomColor: color }]}
              />

              <Text center bold={isActive} color={color} size={22}>
                {parsedLabel[1]}
              </Text>
            </View>
          );
        })}
      </View>

      <View
        style={styles.sliderWrap}
        onLayout={e => setSliderWidth(e.nativeEvent.layout.width)}
        onMoveShouldSetResponderCapture={() => !dragDisabled}
        onResponderGrant={e => startDrag(e.nativeEvent.locationX)}
        onResponderMove={e => setIndexByX(e.nativeEvent.locationX)}
        onResponderRelease={endDrag}
        onResponderTerminate={endDrag}
        onStartShouldSetResponder={() => !dragDisabled}
        onStartShouldSetResponderCapture={() => !dragDisabled}
      >
        <View pointerEvents="none" style={styles.track}>
          <View
            style={[
              styles.trackFill,
              { height: TRACK_HEIGHT, width: progress * sliderWidth },
            ]}
          />
        </View>

        <Slider
          disabled
          maximumTrackTintColor="transparent"
          maximumValue={maxIndex}
          minimumTrackTintColor="transparent"
          minimumValue={0}
          step={1}
          style={styles.slider}
          thumbImage={transparentThumb}
          thumbTintColor="transparent"
          value={index}
          onSlidingComplete={v => setIndex(Math.round(v))}
          onValueChange={v => setIndex(Math.round(v))}
        />

        <View
          pointerEvents="none"
          style={[styles.toggler, { left: togglerLeft }]}
        >
          <SliderToggler />
        </View>
      </View>

      <Button
        disabled={isCorrect != null}
        title={t('check')}
        onPress={answer}
      />

      {isCorrect != null && (
        <AnswerResult
          isCorrect={isCorrect}
          text={
            isCorrect
              ? slide.variants[0].explanation?.content[0]?.content[0]?.text
              : slide.variants[0].wrongExplanation?.content[0]?.content[0]?.text
          }
          onPressNext={goToNextSlide}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: DEFAULT_SPACE,
    paddingHorizontal: DEFAULT_SPACE,
  },
  slider: {
    width: '100%',
    height: 48,
  },
  sliderWrap: {
    marginTop: DEFAULT_SPACE,
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.blightBlue,
    overflow: 'hidden',
    zIndex: 1,
  },
  trackFill: {
    backgroundColor: '#B1CAF6',
    borderRadius: 8,
  },
  labelDivider: {
    borderBottomWidth: 2,
  },
  toggler: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 48,
    backgroundColor: colors.brightDeepBlue,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
});
