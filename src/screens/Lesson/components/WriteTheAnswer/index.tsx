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

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
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

  const inputDisabled = isCorrect != null || isLoading;

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
      <View style={styles.root}>
        <View style={styles.stack}>
          {slide.variants[0].blocks && (
            <Blocks blocks={slide.variants[0].blocks} />
          )}

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
            <View style={styles.imageSideCol}>
              <FullWidthFastImage
                uri={slide.variants[0].numberAnswerSideImageUrl || ''}
              />
            </View>

            <View style={styles.imageSideCol}>
              {slide.variants[0].numberAnswerFields?.map(field =>
                renderFieldInput(field),
              )}
            </View>
          </View>
        )}

        {slide.variants[0].numberAnswerLayout === 'columns' && (
          <View style={styles.columnsRow}>
            <View style={styles.columnsCol}>
              {slide.variants[0].numberAnswerLeftColumnFields?.map(field =>
                renderFieldInput(field),
              )}
            </View>

            <View style={styles.columnsCol}>
              {slide.variants[0].numberAnswerRightColumnFields?.map(field =>
                renderFieldInput(field),
              )}
            </View>
          </View>
        )}

        <View style={styles.bottom}>
          <Button
            disabled={isLoading || isCorrect != null || !allFieldsAnswered}
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
          disabled={isLoading}
          isCorrect={isCorrect}
          isLoading={isLoading}
          content={
            isCorrect
              ? slide.variants[0].explanation
              : slide.variants[0].wrongExplanation
          }
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
    alignItems: 'center',
  },
  columnsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: DEFAULT_SPACE,
  },
  fieldRow: {
    gap: 6,
    alignItems: 'center',
    marginBottom: DEFAULT_SPACE,
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
  },
  root: {
    flex: 1,
    justifyContent: 'space-between',
    gap: DEFAULT_SPACE,
  },
  stack: {
    gap: DEFAULT_SPACE,
  },
});
