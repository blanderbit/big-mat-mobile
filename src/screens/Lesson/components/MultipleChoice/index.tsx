import { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { AnswerVariant } from '@components/AnswerVariant';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { SizedFastImage } from '@components/SizedFastImage';
import { Text } from '@components/Text';
import { WebView } from '@components/WebView';
import { Wrapper } from '@components/Wrapper';

import { DEFAULT_SPACE } from '@extra/constants';
import { getUkrLetterByIndex } from '@extra/getUkrLetterByIndex';
import { isHtmlString } from '@extra/isHtmlString';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.MULTIPLE_CHOICE>;
  lessonId: string;
};

type OptionImageStyle =
  Slide<SlideType.MULTIPLE_CHOICE>['variants'][0]['options'][number]['imageStyle'];

const getOptionImageAlignItems = (
  align: OptionImageStyle['align'],
  isGrid: boolean,
): NonNullable<ViewStyle['alignItems']> => {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  if (align === 'left') return 'flex-start';
  return isGrid ? 'center' : 'flex-start';
};

export const MultipleChoice = ({ slide, lessonId }: Props) => {
  const { t } = useTranslation();
  const [chosenOptionsIds, setChosenOptionsIds] = useState<
    Slide<SlideType.MULTIPLE_CHOICE>['variants'][0]['options'][number]['id'][]
  >([]);
  const [buttonsRowWidth, setButtonsRowWidth] = useState(0);
  const [optionsGridWidth, setOptionsGridWidth] = useState(0);
  const optionsLayout = slide.variants[0].optionsLayout || 'list';
  const isOptionsGrid = optionsLayout === 'grid';
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const optionsCount = slide.variants[0].options.length;
  const optionButtonSize =
    buttonsRowWidth > 0 && optionsCount > 0
      ? Math.floor(
          (buttonsRowWidth - DEFAULT_SPACE * (optionsCount - 1)) / optionsCount,
        )
      : 80;

  const { handleGoToNextSlide, setAnswerResult } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

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

  const renderOptionLabel = (label: string, center?: boolean) => {
    if (isHtmlString(label)) {
      const html = center
        ? `<div style="text-align:center;width:100%">${label}</div>`
        : label;
      return (
        <View
          style={
            center ? styles.optionLabelWebViewCenter : styles.optionLabelWebView
          }
        >
          <WebView embedded html={html} />
        </View>
      );
    }

    return (
      <Text center={center} size={14}>
        {label}
      </Text>
    );
  };

  const answer = () => {
    const correctIds = slide.variants[0].correctOptionIds;
    const chosenIds = chosenOptionsIds;

    setAnswerResult(
      chosenIds.length === correctIds.length &&
        chosenIds.every(id => correctIds.includes(id)) &&
        correctIds?.every(id => chosenIds.includes(id)),
    );
  };

  return (
    <Wrapper>
      {slide.variants[0].blocks && <Blocks blocks={slide.variants[0].blocks} />}

      {slide.variants[0].questionImageUrl && (
        <FullWidthFastImage uri={slide.variants[0].questionImageUrl} />
      )}

      <View
        style={isOptionsGrid ? styles.optionsGrid : styles.optionsList}
        onLayout={
          isOptionsGrid
            ? e => setOptionsGridWidth(e.nativeEvent.layout.width)
            : undefined
        }
      >
        {slide.variants[0].options.map((option, index) => (
          <View
            key={option.id}
            style={
              isOptionsGrid && gridItemWidth != null
                ? [styles.optionsGridItem, { width: gridItemWidth }]
                : isOptionsGrid
                  ? styles.optionsGridItem
                  : undefined
            }
          >
            <View
              style={isOptionsGrid ? styles.optionHeaderGrid : styles.optionHeader}
            >
              <AnswerVariant index={index} />

              {renderOptionLabel(option.label, isOptionsGrid)}
            </View>

            {option.imageUrl ? (
              <View
                style={[
                  styles.optionImageWrap,
                  {
                    alignItems: getOptionImageAlignItems(
                      option.imageStyle?.align,
                      isOptionsGrid,
                    ),
                  },
                ]}
              >
                <SizedFastImage
                  borderRadius={option.imageStyle?.radius}
                  height={option.imageStyle?.height}
                  uri={option.imageUrl}
                  width={option.imageStyle?.width}
                />
              </View>
            ) : null}
          </View>
        ))}
      </View>

      <View
        style={styles.buttonsRow}
        onLayout={e => setButtonsRowWidth(e.nativeEvent.layout.width)}
      >
        {slide.variants[0].options.map((option, index) => (
          <Button
            borderRadius={25}
            disabled={isCorrect != null}
            key={option.id}
            pressed={chosenOptionsIds.includes(option.id)}
            size={optionButtonSize}
            title={getUkrLetterByIndex(index)}
            variant="answer"
            onPress={() => toggleChooseOption(option.id)}
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
  optionsList: {
    gap: DEFAULT_SPACE,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: DEFAULT_SPACE,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionHeaderGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
  },
  optionLabelWebView: {
    flex: 1,
    minWidth: 0,
  },
  optionLabelWebViewCenter: {
    width: '100%',
    alignSelf: 'stretch',
  },
  optionsGridItem: {
    flexGrow: 0,
    flexShrink: 0,
  },
  optionImageWrap: {
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
  },
});
