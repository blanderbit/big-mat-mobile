import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Button } from '@components/Button';
import { FractionKeyboard } from '@components/FractionKeyboard';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Pressable } from '@components/Pressable';
import { SlideQuestion } from '@components/Question';
import { Text } from '@components/Text';
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

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
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
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <Wrapper>
      <View style={styles.root}>
        <View style={styles.questionStack}>
          <SlideQuestion content={slide.variants[0].questionText} />

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

              <Pressable
                style={[
                  styles.inputBox,
                  activeField === 'numerator' ? styles.inputBoxActive : null,
                ]}
                onPress={() => {
                  if (isCorrect != null) return;
                  setActiveField('numerator');
                }}
              >
                <Text semiBold size={34}>
                  {numerator || ' '}
                </Text>
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={[
                  styles.inputBox,
                  activeField === 'denominator' ? styles.inputBoxActive : null,
                ]}
                onPress={() => {
                  if (isCorrect != null) return;
                  setActiveField('denominator');
                }}
              >
                <Text semiBold size={34}>
                  {denominator || ' '}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View>
          <Button
            disabled={isCorrect != null || !numerator || !denominator}
            title={t('check')}
            onPress={answer}
          />
        </View>

        <FractionKeyboard
          disabled={isCorrect != null}
          onBackspace={handleBackspace}
          onDigit={handleDigit}
        />
      </View>

      {isCorrect != null && (
        <AnswerResult
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
  inputBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    height: 60,
    backgroundColor: '#EEEEE2',
    borderWidth: 1,
    borderColor: colors.darkGrey,
    borderRadius: 8,
  },
  inputBoxActive: {
    borderColor: colors.black,
    borderWidth: 2,
  },
  leftCol: {
    width: '50%',
  },
  root: {
    flex: 1,
    justifyContent: 'space-between',
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
