import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { AnswerVariant } from '@components/AnswerVariant';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Pressable } from '@components/Pressable';
import { SlideQuestion } from '@components/Question';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { getUkrLetterByIndex } from '@extra/getUkrLetterByIndex';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.SINGLE_CHOICE>;
  lessonId: string;
};

export const SingleChoice = ({ slide, lessonId }: Props) => {
  const { t } = useTranslation();
  const [chosenOptionId, setChosenOptionId] = useState<
    | Slide<SlideType.SINGLE_CHOICE>['variants'][0]['options'][number]['id']
    | null
  >(null);
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
  const { cardDesign } = slide.variants[0];
  const optionImageBorderColor = slide.variants[0].optionImageBorderColor;
  const optionBlockBackground =
    slide.variants[0].optionBlockBackground ?? colors.brightBeige;

  const getOptionImageStyle = (
    imageStyle:
      | Slide<SlideType.SINGLE_CHOICE>['variants'][0]['options'][number]['imageStyle']
      | undefined,
  ) => {
    if (!imageStyle) return null;
    return {
      width: imageStyle.width,
      height: imageStyle.height,
      borderRadius: imageStyle.radius,
    } as const;
  };

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const gridItemWidth =
    optionsGridWidth > 0
      ? Math.floor((optionsGridWidth - DEFAULT_SPACE) / 2)
      : undefined;

  const chooseOption = (
    optionId: Slide<SlideType.SINGLE_CHOICE>['variants'][0]['options'][number]['id'],
  ) => {
    setChosenOptionId(optionId);
  };

  const answer = () => {
    const correctIds = slide.variants[0].correctOptionIds;
    if (chosenOptionId == null) return;
    setIsCorrect(correctIds.length === 1 && correctIds[0] === chosenOptionId);
  };

  return (
    <Wrapper>
      <SlideQuestion content={slide.variants[0].questionText} />

      {slide.variants[0].questionImageUrl && (
        <FullWidthFastImage uri={slide.variants[0].questionImageUrl} />
      )}

      {cardDesign === 'blocks_description_buttons' &&
      slide.variants[0].descriptionBlocks ? (
        <Blocks blocks={slide.variants[0].descriptionBlocks} />
      ) : null}

      {cardDesign === 'block_as_button' ? (
        <View style={styles.blockAsButtonList}>
          {slide.variants[0].options.map((option, index) => {
            const isChosen = chosenOptionId === option.id;
            return (
              <Pressable
                disabled={isCorrect != null}
                key={option.id}
                style={[
                  styles.blockAsButtonItem,
                  { backgroundColor: optionBlockBackground },
                  isChosen ? styles.blockAsButtonItemChosen : null,
                ]}
                onPress={() => chooseOption(option.id)}
              >
                <View style={styles.optionHeader}>
                  <AnswerVariant index={index} />
                  <Text center size={14}>
                    {option.label}
                  </Text>
                </View>

                {option.imageUrl ? (
                  <FullWidthFastImage
                    style={getOptionImageStyle(option.imageStyle)}
                    uri={option.imageUrl}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : cardDesign === 'image_and_button_combined' ? (
        <View
          style={styles.imageTopButtonsGrid}
          onLayout={e => setOptionsGridWidth(e.nativeEvent.layout.width)}
        >
          {slide.variants[0].options.map((option, index) => (
            <View
              key={option.id}
              style={
                gridItemWidth != null
                  ? [styles.imageTopButtonsItem, { width: gridItemWidth }]
                  : styles.imageTopButtonsItem
              }
            >
              {option.imageUrl ? (
                <View
                  style={[
                    styles.imageTopButtonsImageWrap,
                    optionImageBorderColor || option.imageStyle
                      ? styles.imageTopButtonsImageWrapBorder
                      : null,
                    optionImageBorderColor
                      ? { borderColor: optionImageBorderColor }
                      : null,
                    option.imageStyle?.radius != null
                      ? { borderRadius: option.imageStyle.radius }
                      : null,
                  ]}
                >
                  <FullWidthFastImage
                    uri={option.imageUrl}
                    style={[
                      styles.imageTopButtonsImage,
                      getOptionImageStyle(option.imageStyle),
                    ]}
                  />
                </View>
              ) : null}

              <Text center size={14}>
                {option.label}
              </Text>

              <Button
                disabled={isCorrect != null}
                pressed={chosenOptionId === option.id}
                title={getUkrLetterByIndex(index)}
                width="100%"
                onPress={() => chooseOption(option.id)}
              />
            </View>
          ))}
        </View>
      ) : (
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
      )}

      {cardDesign !== 'image_and_button_combined' &&
      cardDesign !== 'block_as_button' ? (
        <View
          style={styles.buttonsRow}
          onLayout={e => setButtonsRowWidth(e.nativeEvent.layout.width)}
        >
          {slide.variants[0].options.map((option, index) => (
            <Button
              disabled={isCorrect != null}
              key={option.id}
              pressed={chosenOptionId === option.id}
              title={getUkrLetterByIndex(index)}
              width={optionButtonSize}
              onPress={() => chooseOption(option.id)}
            />
          ))}
        </View>
      ) : null}

      <Button
        disabled={chosenOptionId == null || isCorrect != null || isLoading}
        title={t('check')}
        onPress={answer}
      />

      {isCorrect != null && (
        <AnswerResult
          buttonText={slide.variants[0].buttonText || ''}
          disabled={isLoading}
          isCorrect={isCorrect}
          isLoading={isLoading}
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
  blockAsButtonItem: {
    borderRadius: 12,
    padding: DEFAULT_SPACE,
    gap: DEFAULT_SPACE,
    alignItems: 'center',
  },
  blockAsButtonItemChosen: {
    borderColor: colors.pink,
    borderWidth: 2,
  },
  blockAsButtonList: {
    gap: DEFAULT_SPACE,
  },
  imageTopButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: DEFAULT_SPACE,
  },
  imageTopButtonsItem: {
    gap: DEFAULT_SPACE,
  },
  imageTopButtonsImageWrap: {
    width: '100%',
  },
  imageTopButtonsImageWrapBorder: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageTopButtonsImage: {
    width: '100%',
  },
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
  },
});
