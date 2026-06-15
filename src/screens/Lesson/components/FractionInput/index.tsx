import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Input } from '@components/Input';
import { Keyboard } from '@components/Keyboard';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

import Arrow from '@assets/images/arrow.svg';

type Props = {
  slide: Slide<SlideType.FRACTION_INPUT>;
  lessonId: string;
};

export const FractionInput = ({ slide, lessonId }: Props) => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [activeField, setActiveField] = useState<'numerator' | 'denominator'>(
    'numerator',
  );
  const { t } = useTranslation();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleBackspace = () => {
    if (activeField === 'denominator') {
      setDenominator(prev => prev.slice(0, -1));
      return;
    }

    setNumerator(prev => prev.slice(0, -1));
  };

  const handleDigit = (digit: string) => {
    if (activeField === 'numerator') {
      setNumerator(prev => `${prev}${digit}`);
      return;
    }
    setDenominator(prev => `${prev}${digit}`);
  };

  const { handleGoToNextSlide, setAnswerResult } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const answer = async () => {
    if (
      slide.variants[0].correctNumerator === Number(numerator) &&
      slide.variants[0].correctDenominator === Number(denominator)
    ) {
      setAnswerResult(true);
    } else {
      setAnswerResult(false);
    }
  };

  return (
    <Wrapper>
      <View style={styles.root}>
        {slide.variants[0].blocks && (
          <Blocks blocks={slide.variants[0].blocks} />
        )}

        <View style={styles.questionStack}>
          <View style={styles.row}>
            <View style={styles.leftCol}>
              {slide.variants[0].questionImageUrl && (
                <FullWidthFastImage uri={slide.variants[0].questionImageUrl} />
              )}
            </View>

            <View style={styles.rightCol}>
              <View style={styles.arrow}>
                <Arrow />
              </View>

              <Input
                active={activeField === 'numerator'}
                disabled={isCorrect != null}
                value={numerator}
                onPress={() => setActiveField('numerator')}
              />

              <View style={styles.divider} />

              <Input
                active={activeField === 'denominator'}
                disabled={isCorrect != null}
                value={denominator}
                onPress={() => setActiveField('denominator')}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          <Button
            disabled={isCorrect != null || !numerator || !denominator}
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
    marginTop: 'auto',
  },
  questionStack: {
    gap: DEFAULT_SPACE,
  },
  arrow: {
    position: 'absolute',
    left: '12%',
    top: 0,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: colors.black,
    marginVertical: 4,
    width: 60,
  },
  leftCol: {
    width: '50%',
  },
  root: {
    flex: 1,
    gap: DEFAULT_SPACE,
  },
  rightCol: {
    width: '50%',
    alignItems: 'center',
    paddingLeft: '15%',
  },
  row: {
    backgroundColor: colors.brightBeige,
    flexDirection: 'row',
    alignItems: 'center',
    padding: DEFAULT_SPACE,
    borderRadius: 26,
  },
});
