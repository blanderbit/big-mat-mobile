import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';
import { AnswerResult } from '@screens/Lesson/components/AnswerResult';
import { SlideQuestion } from '@screens/Lesson/components/Question';
import { Wrapper } from '@screens/Lesson/components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { useLessonsStore } from '@stores/lessonsStore';

import Arrow from '@assets/images/arrow.svg';
import BackArrow2 from '@assets/images/backArrow2.svg';

type Props = {
  slide: Slide<SlideType.FRACTION_INPUT>;
};

export const FractionInput = ({ slide }: Props) => {
  console.log('FractionInput slide', slide);
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const { t } = useTranslation();
  const goToNetSlide = useLessonsStore(state => state.goToNetSlide);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const keyboardSet: Array<
    { type: 'digit'; value: string } | { type: 'empty' } | { type: 'backspace' }
  > = [
    { type: 'digit', value: '1' },
    { type: 'digit', value: '2' },
    { type: 'digit', value: '3' },
    { type: 'digit', value: '4' },
    { type: 'digit', value: '5' },
    { type: 'digit', value: '6' },
    { type: 'digit', value: '7' },
    { type: 'digit', value: '8' },
    { type: 'digit', value: '9' },
    { type: 'empty' },
    { type: 'digit', value: '0' },
    { type: 'backspace' },
  ];

  const handleBackspace = () => {
    if (denominator) {
      setDenominator(prev => prev.slice(0, -1));
      return;
    }

    if (numerator) {
      setNumerator(prev => prev.slice(0, -1));
    }
  };

  const answer = async () => {
    try {
      //   await API.post(`/v1/content/routes/${lessonId}/answer`, {
      //     answer: slide.variants[0].answer,
      //   });
      if (
        slide.variants[0].correctNumerator === Number(numerator) &&
        slide.variants[0].correctDenominator === Number(denominator)
      ) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    } finally {
    }
  };

  return (
    <Wrapper>
      <View style={styles.root}>
        <View style={{ gap: DEFAULT_SPACE }}>
          <SlideQuestion
            text={slide.variants[0].questionText.content[0].content[0].text}
          />

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

              <View style={styles.inputBox}>
                <Text semiBold size={34}>
                  {numerator}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputBox}>
                <Text semiBold size={34}>
                  {denominator}
                </Text>
              </View>
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

        <View style={styles.keyboard}>
          {keyboardSet.map((el, index) => {
            const isDisabledKey =
              el.type === 'empty' || el.type === 'backspace';

            return (
              <Pressable
                key={index}
                style={[
                  styles.key,
                  isDisabledKey ? styles.keyDisabled : styles.keyEnabled,
                ]}
                onPress={
                  isCorrect != null
                    ? undefined
                    : () => {
                        if (el.type === 'digit') {
                          if (!numerator) {
                            setNumerator(el.value);
                            return;
                          }

                          if (!denominator) {
                            setDenominator(el.value);
                            return;
                          }

                          return;
                        }

                        if (el.type === 'backspace') {
                          handleBackspace();
                        }
                      }
                }
              >
                {el.type === 'digit' ? (
                  <Text semiBold size={34} style={styles.keyText}>
                    {el.value}
                  </Text>
                ) : el.type === 'backspace' ? (
                  <View style={styles.backspaceIconWrap}>
                    <BackArrow2 />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {isCorrect != null && (
        <AnswerResult
          isCorrect={isCorrect}
          text={
            isCorrect
              ? slide.variants[0].explanation?.content[0]?.content[0]?.text
              : slide.variants[0].wrongExplanation?.content[0]?.content[0]?.text
          }
          onPressNext={goToNetSlide}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    left: '12%',
    top: 0,
  },
  backspaceIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
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
    width: 60,
    height: 60,
    backgroundColor: '#EEEEE2',
    borderWidth: 1,
    borderColor: colors.darkGrey,
    borderRadius: 8,
  },
  key: {
    width: '30%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  keyEnabled: {
    backgroundColor: colors.brightBeige,
    borderWidth: 1,
    borderColor: colors.darkGrey,
  },
  keyText: {
    ...(Platform.OS === 'android'
      ? {
          includeFontPadding: false,
          lineHeight: 34,
          textAlignVertical: 'center',
        }
      : null),
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
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
