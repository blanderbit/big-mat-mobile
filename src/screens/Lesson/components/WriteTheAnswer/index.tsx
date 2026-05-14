import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Input } from '@components/Input';
import { Keyboard } from '@components/Keyboard';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.NUMBER_ANSWER>;
  lessonId: string;
};

type NumberAnswerField = { id: string; label: string; correctNumber: number };

const getFieldsForVariant = (
  variant: Slide<SlideType.NUMBER_ANSWER>['variants'][number],
): NumberAnswerField[] => {
  if (variant.numberAnswerLayout === 'image_side') {
    return variant.numberAnswerFields ?? [];
  }
  if (variant.numberAnswerLayout === 'columns') {
    return [
      ...(variant.numberAnswerLeftColumnFields ?? []),
      ...(variant.numberAnswerRightColumnFields ?? []),
    ];
  }
  return [];
};

export const WriteTheAnswer = ({ slide, lessonId }: Props) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [value, setValue] = useState('');
  const [activeFieldId, setActiveFieldId] = useState<string | null>(
    getFieldsForVariant(slide.variants[0])[0]?.id ?? null,
  );
  const [valueByFieldId, setValueByFieldId] = useState<Record<string, string>>(
    {},
  );
  const { t } = useTranslation();

  const { handleGoToNextSlide } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const handleDigit = (digit: string) => {
    if (slide.variants[0].correctNumber != null) {
      setValue(prev => `${prev}${digit}`);
      return;
    }

    if (!activeFieldId) return;
    setValueByFieldId(prev => ({
      ...prev,
      [activeFieldId]: `${prev[activeFieldId] ?? ''}${digit}`,
    }));
  };

  const handleBackspace = () => {
    if (slide.variants[0].correctNumber != null) {
      setValue(prev => prev.slice(0, -1));
      return;
    }

    if (!activeFieldId) return;
    setValueByFieldId(prev => ({
      ...prev,
      [activeFieldId]: (prev[activeFieldId] ?? '').slice(0, -1),
    }));
  };

  const answer = () => {
    if (slide.variants[0].numberAnswerLayout === 'blocks_below') {
      setIsCorrect(Number(value) === slide.variants[0].correctNumber);
      return;
    }

    if (slide.variants[0].numberAnswerLayout === 'image_side') {
      const fields = slide.variants[0].numberAnswerFields;
      if (!fields?.length) return;

      const allCorrect = fields.every(field => {
        const v = valueByFieldId[field.id];
        return v != null && v !== '' && Number(v) === field.correctNumber;
      });
      setIsCorrect(allCorrect);
      return;
    }

    if (slide.variants[0].numberAnswerLayout === 'columns') {
      const fields = getFieldsForVariant(slide.variants[0]);
      if (!fields.length) return;
      const allCorrect = fields.every(field => {
        const v = valueByFieldId[field.id];
        return v != null && v !== '' && Number(v) === field.correctNumber;
      });
      setIsCorrect(allCorrect);
    }
  };

  const allFieldsAnswered =
    slide.variants[0].correctNumber != null
      ? Boolean(value)
      : (() => {
          const fields = getFieldsForVariant(slide.variants[0]);
          if (!fields.length) return false;
          return fields.every(f => (valueByFieldId[f.id] ?? '') !== '');
        })();

  const inputDisabled = isCorrect != null;

  const middleBlock = slide.variants[0].numberAnswerMiddleBlock;
  const middleSpacing = middleBlock?.spacing;
  const middleTranslateX =
    (middleSpacing?.left ?? 0) - (middleSpacing?.right ?? 0);
  const middleTranslateY =
    -18 + (middleSpacing?.top ?? 0) - (middleSpacing?.bottom ?? 0);

  const middleDecoration: Array<'underline' | 'line-through'> = [];
  if (middleBlock?.textStyle?.underline) middleDecoration.push('underline');
  if (middleBlock?.textStyle?.strike) middleDecoration.push('line-through');

  const middleImageStyle = middleBlock?.imageStyle
    ? {
        width: middleBlock.imageStyle.width,
        height: middleBlock.imageStyle.height,
        borderRadius: middleBlock.imageStyle.radius,
      }
    : null;

  const sideImageSpacing = slide.variants[0].numberAnswerSideImageSpacing;
  const sideImageStyle = slide.variants[0].numberAnswerSideImageStyle;
  const sideImageWrapStyle =
    sideImageSpacing || sideImageStyle
      ? {
          marginBottom: sideImageSpacing?.bottom,
          marginLeft: sideImageSpacing?.left,
          marginRight: sideImageSpacing?.right,
          marginTop: sideImageSpacing?.top,
          width: sideImageStyle?.width,
          height: sideImageStyle?.height,
          borderRadius: sideImageStyle?.radius,
          overflow:
            sideImageStyle?.radius != null ? ('hidden' as const) : undefined,
        }
      : null;

  const sideImageInnerStyle = sideImageStyle
    ? {
        width: sideImageStyle.width,
        height: sideImageStyle.height,
        borderRadius: sideImageStyle.radius,
      }
    : null;

  const middleTextExtraStyle = middleBlock?.textStyle
    ? {
        fontStyle: middleBlock.textStyle.italic
          ? ('italic' as const)
          : ('normal' as const),
        textDecorationLine: (middleDecoration.length
          ? middleDecoration.join(' ')
          : 'none') as
          | 'none'
          | 'underline'
          | 'line-through'
          | 'underline line-through',
      }
    : null;

  const renderFieldInput = (field: { id: string; label: string }) => {
    const fieldValue = valueByFieldId[field.id] ?? '';
    const isActive = activeFieldId === field.id;

    return (
      <View key={field.id} style={styles.fieldRow}>
        <Text size={14}>{field.label}</Text>

        <Input
          active={isActive}
          disabled={inputDisabled}
          value={fieldValue}
          onPress={() => setActiveFieldId(field.id)}
        />
      </View>
    );
  };

  return (
    <Wrapper>
      {slide.variants[0].blocks && <Blocks blocks={slide.variants[0].blocks} />}

      <View style={styles.root}>
        <View style={styles.stack}>
          <View style={{ width: '50%' }}>
            <Text>{slide.variants[0].numberAnswerCorrectTitle}</Text>
          </View>

          {slide.variants[0].numberAnswerLayout === 'blocks_below' ? (
            <View style={styles.inputRow}>
              <Input
                active={isCorrect == null}
                disabled={isCorrect != null}
                value={value}
                onPress={() => {}}
              />
            </View>
          ) : null}
        </View>

        {slide.variants[0].numberAnswerLayout === 'image_side' && (
          <View
            style={[
              styles.imageSideRow,
              slide.variants[0].numberAnswerSideImagePosition === 'left'
                ? null
                : styles.imageSideRowReverse,
            ]}
          >
            <View style={[styles.imageSideCol, sideImageWrapStyle]}>
              <FullWidthFastImage
                style={sideImageInnerStyle}
                uri={slide.variants[0].numberAnswerSideImageUrl || ''}
              />
            </View>

            <View style={styles.imageSideCol}>
              {slide.variants[0].numberAnswerFields?.map((field, idx, arr) => (
                <View key={field.id}>
                  {renderFieldInput(field)}
                  {idx < arr.length - 1 ? (
                    <View style={styles.fieldDivider} />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        )}

        {slide.variants[0].numberAnswerLayout === 'columns' && (
          <View style={styles.columnsRow}>
            <View style={styles.columnsCol}>
              {slide.variants[0].numberAnswerLeftColumnFields?.map(
                (field, idx, arr) => (
                  <View key={field.id} style={styles.fieldBlock}>
                    {renderFieldInput(field)}
                    {idx < arr.length - 1 ? (
                      <View style={styles.fieldDivider} />
                    ) : null}
                  </View>
                ),
              )}
            </View>

            <View
              pointerEvents="none"
              style={[
                styles.columnsEquals,
                {
                  transform: [
                    { translateX: middleTranslateX },
                    { translateY: middleTranslateY },
                  ],
                },
              ]}
            >
              {slide.variants[0].numberAnswerMiddleBlock?.type === 'text' ? (
                <Text
                  color={middleBlock?.textStyle?.color}
                  size={28}
                  style={middleTextExtraStyle}
                >
                  {slide.variants[0].numberAnswerMiddleBlock.text}
                </Text>
              ) : null}

              {slide.variants[0].numberAnswerMiddleBlock?.type === 'image' ? (
                <FullWidthFastImage
                  style={middleImageStyle}
                  uri={slide.variants[0].numberAnswerMiddleBlock.imageUrl || ''}
                />
              ) : null}
            </View>

            <View style={styles.columnsCol}>
              {slide.variants[0].numberAnswerRightColumnFields?.map(
                (field, idx, arr) => (
                  <View key={field.id} style={styles.fieldBlock}>
                    {renderFieldInput(field)}
                    {idx < arr.length - 1 ? (
                      <View style={styles.fieldDivider} />
                    ) : null}
                  </View>
                ),
              )}
            </View>
          </View>
        )}

        <View style={styles.bottom}>
          <Button
            disabled={isCorrect != null || !allFieldsAnswered}
            title={t('check')}
            onPress={answer}
          />

          <Keyboard
            disabled={isCorrect != null}
            onBackspace={handleBackspace}
            onDigit={handleDigit}
          />
        </View>
      </View>

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
  bottom: {
    gap: DEFAULT_SPACE,
  },
  columnsCol: {
    flex: 1,
    alignItems: 'stretch',
    zIndex: 2,
  },
  columnsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: DEFAULT_SPACE,
    position: 'relative',
  },
  columnsEquals: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  fieldRow: {
    gap: 6,
    alignItems: 'center',
    marginBottom: DEFAULT_SPACE,
  },
  fieldBlock: {
    width: '100%',
    alignItems: 'center',
  },
  fieldDivider: {
    height: 2,
    backgroundColor: colors.black,
    width: '60%',
    alignSelf: 'center',
    borderRadius: 9999,
    marginVertical: DEFAULT_SPACE / 2,
  },
  imageSideCol: {
    flex: 1,
  },
  imageSideRow: {
    flexDirection: 'row',
    gap: DEFAULT_SPACE,
    alignItems: 'center',
  },
  imageSideRowReverse: {
    flexDirection: 'row-reverse',
  },
  inputRow: {
    alignItems: 'center',
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'space-between',
    gap: DEFAULT_SPACE,
  },
  stack: {
    gap: DEFAULT_SPACE,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brightBeige,
    borderRadius: 24,
    padding: DEFAULT_SPACE,
  },
});
