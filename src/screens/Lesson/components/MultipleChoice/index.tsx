import { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Pressable } from '@components/Pressable';
import { SizedFastImage } from '@components/SizedFastImage';
import { Text } from '@components/Text';
import { WebView } from '@components/WebView';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
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
  align: NonNullable<OptionImageStyle>['align'] | undefined,
  isGrid: boolean,
): NonNullable<ViewStyle['alignItems']> => {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  if (align === 'left') return 'flex-start';
  return isGrid ? 'center' : 'flex-start';
};

const getOptionImageStyle = (imageStyle: OptionImageStyle) => {
  if (!imageStyle) return null;
  return {
    width: imageStyle.width,
    height: imageStyle.height,
    borderRadius: imageStyle.radius,
  } as const;
};

export const MultipleChoice = ({ slide, lessonId }: Props) => {
  const { t } = useTranslation();
  const [chosenOptionsIds, setChosenOptionsIds] = useState<
    Slide<SlideType.MULTIPLE_CHOICE>['variants'][0]['options'][number]['id'][]
  >([]);
  const [optionsGridWidth, setOptionsGridWidth] = useState(0);
  const optionsLayout = slide.variants[0].optionsLayout || 'list';
  const isOptionsGrid = optionsLayout === 'grid';
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const optionBlockBackground =
    slide.variants[0].optionBlockBackground ?? colors.brightBeige;

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

  const gridItemStyle =
    isOptionsGrid && gridItemWidth != null
      ? [styles.optionsGridItem, { width: gridItemWidth }]
      : isOptionsGrid
        ? [styles.optionsGridItem, styles.optionsGridItemFallback]
        : undefined;

  const onOptionsContainerLayout = isOptionsGrid
    ? (e: { nativeEvent: { layout: { width: number } } }) =>
        setOptionsGridWidth(e.nativeEvent.layout.width)
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
    if (!label) return null;

    if (isHtmlString(label)) {
      return (
        <View
          style={
            center ? styles.optionLabelWebViewCenter : styles.optionLabelWebView
          }
        >
          <WebView embedded html={label} />
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

      {slide.variants[0].questionImageUrl ? (
        <FullWidthFastImage uri={slide.variants[0].questionImageUrl} />
      ) : null}

      <View
        style={
          isOptionsGrid ? styles.blockAsButtonGrid : styles.blockAsButtonList
        }
        onLayout={onOptionsContainerLayout}
      >
        {slide.variants[0].options.map(option => {
          const isChosen = chosenOptionsIds.includes(option.id);

          return (
            <Pressable
              disabled={isCorrect != null}
              key={option.id}
              style={[
                styles.blockAsButtonItem,
                isOptionsGrid
                  ? styles.blockAsButtonItemGrid
                  : styles.blockAsButtonItemList,
                { backgroundColor: optionBlockBackground },
                isChosen ? styles.blockAsButtonItemChosen : null,
                gridItemStyle,
              ]}
              onPress={() => toggleChooseOption(option.id)}
            >
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
                    style={getOptionImageStyle(option.imageStyle)}
                    uri={option.imageUrl}
                    width={option.imageStyle?.width}
                  />
                </View>
              ) : null}

              {renderOptionLabel(option.label, isOptionsGrid)}
            </Pressable>
          );
        })}
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
  blockAsButtonItem: {
    borderRadius: 12,
    padding: DEFAULT_SPACE,
    gap: DEFAULT_SPACE,
  },
  blockAsButtonItemList: {
    alignItems: 'stretch',
    width: '100%',
  },
  blockAsButtonItemGrid: {
    alignItems: 'center',
  },
  blockAsButtonItemChosen: {
    borderColor: colors.pink,
    borderWidth: 2,
  },
  blockAsButtonList: {
    gap: DEFAULT_SPACE,
  },
  blockAsButtonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: DEFAULT_SPACE,
  },
  optionLabelWebView: {
    width: '100%',
    alignSelf: 'stretch',
  },
  optionLabelWebViewCenter: {
    width: '100%',
    alignSelf: 'stretch',
  },
  optionsGridItem: {
    flexGrow: 0,
    flexShrink: 0,
  },
  optionsGridItemFallback: {
    width: '47%',
  },
  optionImageWrap: {
    width: '100%',
  },
});
