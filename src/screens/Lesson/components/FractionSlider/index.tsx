import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

import SliderToggler from '@assets/images/sliderToggler.svg';
import transparent48x48 from '@assets/images/transparent48x48.png';

const LABEL_WIDTH = 56;
const TOGGLER_SIZE = 48;

type Props = {
  slide: Slide<SlideType.FRACTION_SLIDER>;
  setScrollEnabled?: (enabled: boolean) => void;
  lessonId: string;
};

const getQuestionImageStyle = (
  imageStyle:
    | Slide<SlideType.FRACTION_SLIDER>['variants'][0]['questionImageStyle']
    | undefined,
) => {
  if (!imageStyle) return undefined;
  return {
    ...(imageStyle.width != null ? { width: imageStyle.width } : {}),
    ...(imageStyle.height != null ? { height: imageStyle.height } : {}),
    ...(imageStyle.radius != null ? { borderRadius: imageStyle.radius } : {}),
  };
};

const getSpacingStyle = (
  spacing:
    | Slide<SlideType.FRACTION_SLIDER>['variants'][0]['questionImageSpacing']
    | undefined,
) => {
  if (!spacing) return null;
  return {
    marginTop: spacing.margin?.top,
    marginRight: spacing.margin?.right,
    marginBottom: spacing.margin?.bottom,
    marginLeft: spacing.margin?.left,
    paddingTop: spacing.padding?.top,
    paddingRight: spacing.padding?.right,
    paddingBottom: spacing.padding?.bottom,
    paddingLeft: spacing.padding?.left,
  } as const;
};

export const FractionSlider = ({
  setScrollEnabled,
  slide,
  lessonId,
}: Props) => {
  // TODO: finish after API is ready
  const options = slide.variants[0].options;
  const maxIndex = Math.max(0, options.length - 1);
  const [index, setIndex] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const transparentThumb = Image.resolveAssetSource(transparent48x48);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { t } = useTranslation();

  const { handleGoToNextSlide, setAnswerResult } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const answerId = options[index].id;
  const dragDisabled = isCorrect != null;

  const answer = async () => {
    const correctIds = slide.variants[0].correctOptionIds;
    const chosenIds = [answerId];

    setAnswerResult(
      chosenIds.length === correctIds.length &&
        chosenIds.every(id => correctIds.includes(id)) &&
        correctIds.every(id => chosenIds.includes(id)),
    );
  };

  const progress = maxIndex === 0 ? 0 : index / maxIndex;
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
      <Blocks blocks={slide.variants[0].blocks ?? []} />

      {slide.variants[0].questionImageUrl && (
        <View
          style={[
            styles.questionImageWrap,
            getSpacingStyle(slide.variants[0].questionImageSpacing),
          ]}
        >
          <FullWidthFastImage
            uri={slide.variants[0].questionImageUrl}
            style={[
              styles.questionImage,
              getQuestionImageStyle(slide.variants[0].questionImageStyle),
            ]}
          />
        </View>
      )}

      <View pointerEvents="none" style={styles.labelsRow}>
        {sliderWidth > 0 &&
          options.map((opt, i) => {
            const optionProgress = maxIndex === 0 ? 0 : i / maxIndex;
            const center =
              optionProgress * (sliderWidth - TOGGLER_SIZE) + TOGGLER_SIZE / 2;
            const isActive = i === index;
            const parsedLabel = opt.label.split('/');
            const color = isActive ? colors.black : colors.darkGrey;

            return (
              <View
                key={opt.id}
                style={[styles.label, { left: center - LABEL_WIDTH / 2 }]}
              >
                {parsedLabel.length === 2 ? (
                  <View style={styles.labelColumn}>
                    <Text
                      center
                      bold={isActive}
                      color={color}
                      size={22}
                      style={styles.labelText}
                    >
                      {parsedLabel[0]}
                    </Text>
                    <View
                      style={[styles.labelDivider, { backgroundColor: color }]}
                    />
                    <Text
                      center
                      bold={isActive}
                      color={color}
                      size={22}
                      style={styles.labelText}
                    >
                      {parsedLabel[1]}
                    </Text>
                  </View>
                ) : (
                  <Text
                    center
                    bold={isActive}
                    color={color}
                    size={22}
                    style={styles.labelText}
                  >
                    {opt.label}
                  </Text>
                )}
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
          buttonText={slide.variants[0].buttonText || ''}
          isCorrect={isCorrect}
          content={
            isCorrect
              ? slide.variants[0].explanation
              : slide.variants[0].wrongExplanation
          }
          onClose={() => setIsCorrect(null)}
          onPressNext={handleGoToNextSlide}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  questionImageWrap: {
    width: '100%',
    alignItems: 'center',
  },
  questionImage: {
    width: '100%',
    maxWidth: '100%',
  },
  labelsRow: {
    position: 'relative',
    width: '100%',
    height: 70,
    marginTop: DEFAULT_SPACE,
  },
  label: {
    position: 'absolute',
    top: 0,
    width: LABEL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelColumn: {
    width: '100%',
    alignItems: 'center',
  },
  labelText: {
    width: '100%',
    textAlign: 'center',
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
    width: 28,
    height: 2,
    marginVertical: 2,
    borderRadius: 1,
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
