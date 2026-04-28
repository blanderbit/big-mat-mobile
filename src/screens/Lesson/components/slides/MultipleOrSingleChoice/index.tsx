import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Text } from '@components/Text';
import { AnswerResult } from '@screens/Lesson/components/AnswerResult';
import { AnswerVariant } from '@screens/Lesson/components/AnswerVariant';
import { SlideQuestion } from '@screens/Lesson/components/Question';
import { Wrapper } from '@screens/Lesson/components/Wrapper';

import { DEFAULT_SPACE } from '@extra/constants';
import { getUkrLetterByIndex } from '@extra/getUkrLetterByIndex';
import { Slide, SlideType } from '@extra/types';
import { useLessonsStore } from '@stores/lessonsStore';

type Props = {
  slide: Slide<SlideType.MULTIPLE_CHOICE | SlideType.SINGLE_CHOICE>;
  type: 'multiple' | 'single';
};

export const MultipleOrSingleChoice = ({ slide, type }: Props) => {
  console.log('MultipleOrSingleChoice slide', slide);
  const { t } = useTranslation();
  const [chosenOptionsIds, setChosenOptionsIds] = useState<
    Slide<SlideType.MULTIPLE_CHOICE>['variants'][0]['options'][number]['id'][]
  >([]);
  const [buttonsRowWidth, setButtonsRowWidth] = useState(0);
  const [optionsGridWidth, setOptionsGridWidth] = useState(0);
  const optionsLayout = slide.variants[0].optionsLayout || 'list';
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const optionsCount = slide.variants[0].options.length;
  const optionButtonSize =
    buttonsRowWidth > 0 && optionsCount > 0
      ? Math.floor(
          (buttonsRowWidth - DEFAULT_SPACE * (optionsCount - 1)) / optionsCount,
        )
      : 80;
  const goToNextSlide = useLessonsStore(state => state.goToNextSlide);

  const gridItemWidth =
    optionsGridWidth > 0
      ? Math.floor((optionsGridWidth - DEFAULT_SPACE) / 2)
      : undefined;

  const toggleChooseOption = (
    optionId: Slide<SlideType.MULTIPLE_CHOICE>['variants'][0]['options'][number]['id'],
  ) => {
    setChosenOptionsIds(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      }
      return [...prev, optionId];
    });
  };

  const chooseOption = (
    optionId: Slide<SlideType.MULTIPLE_CHOICE>['variants'][0]['options'][number]['id'],
  ) => {
    setChosenOptionsIds([optionId]);
  };

  const answer = async () => {
    //   await API.post(`/v1/content/routes/${lessonId}/answer`, {
    //     answer: slide.variants[0].answer,
    //   });
    const correctIds = slide.variants[0].correctOptionIds;
    const chosenIds = chosenOptionsIds;

    setIsCorrect(
      chosenIds.length === correctIds.length &&
        chosenIds.every(id => correctIds.includes(id)) &&
        correctIds.every(id => chosenIds.includes(id)),
    );
  };

  return (
    <Wrapper>
      <SlideQuestion
        text={slide.variants[0].questionText.content[0].content[0].text}
      />

      {slide.variants[0].questionImageUrl && (
        <FullWidthFastImage uri={slide.variants[0].questionImageUrl} />
      )}

      <View
        style={
          optionsLayout === 'grid' ? styles.optionsGrid : styles.optionsList
        }
        onLayout={
          optionsLayout === 'grid'
            ? e => setOptionsGridWidth(e.nativeEvent.layout.width)
            : undefined
        }
      >
        {slide.variants[0].options.map((option, index) => (
          <View
            key={option.id}
            style={
              optionsLayout === 'grid' && gridItemWidth != null
                ? [styles.optionsGridItem, { width: gridItemWidth }]
                : undefined
            }
          >
            <View style={styles.optionHeader}>
              <AnswerVariant index={index} />

              <Text size={14}>{option.label}</Text>
            </View>

            {option.imageUrl && <FullWidthFastImage uri={option.imageUrl} />}
          </View>
        ))}
      </View>

      <View
        style={styles.buttonsRow}
        onLayout={e => setButtonsRowWidth(e.nativeEvent.layout.width)}
      >
        {slide.variants[0].options.map((option, index) => (
          // size: чтобы все кнопки влезали в 1 строку
          // width = rowWidth - gaps
          // size = floor(width / count)
          <Button
            borderRadius={25}
            disabled={isCorrect != null}
            key={option.id}
            pressed={chosenOptionsIds.includes(option.id)}
            size={optionButtonSize}
            title={getUkrLetterByIndex(index)}
            onPress={() =>
              type === 'multiple'
                ? toggleChooseOption(option.id)
                : chooseOption(option.id)
            }
          />
        ))}
      </View>

      <Button
        disabled={!chosenOptionsIds.length || isCorrect != null}
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
  optionsList: {
    gap: DEFAULT_SPACE,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DEFAULT_SPACE,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionsGridItem: {
    flexGrow: 0,
    flexShrink: 0,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});
