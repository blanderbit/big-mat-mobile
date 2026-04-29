import { useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

import Arrow2 from '@assets/images/arrow2.svg';
import ArrowDown from '@assets/images/arrowDown.svg';
import background1 from '@assets/images/background1.png';
import background7 from '@assets/images/background7.png';
import Background11 from '@assets/images/background11.svg';
import background13 from '@assets/images/background13.png';
import background14 from '@assets/images/background14.png';
import background17 from '@assets/images/background17.png';
import background20 from '@assets/images/background20.png';
import Background24 from '@assets/images/background24.svg';
import Background25 from '@assets/images/background25.svg';
import Background26 from '@assets/images/background26.svg';
import Background27 from '@assets/images/background27.svg';
import Background28 from '@assets/images/background28.svg';
import background29 from '@assets/images/background29.png';
import background30 from '@assets/images/background30.png';

type Props = {
  lessonId: string;
  slide: Slide<SlideType.COMIC>;
};

export const Comics2 = ({ lessonId, slide }: Props) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect: true,
    lessonId,
    slideId: slide.id,
  });

  const questsPhrase = [t('howWill'), t('divide?')];

  const guests = [
    {
      name: t('culbabka'),
      image: Background25,
    },
    {
      name: t('lapun'),
      image: Background26,
    },
    {
      name: t('kruglik'),
      image: Background27,
    },
    {
      name: t('andFishik'),
      image: Background28,
    },
  ];

  const answerOptions = ['1/5', '2/5', '3/5', '4/5'];

  return (
    <View
      style={[
        styles.root,
        {
          marginBottom: -bottom - DEFAULT_SPACE,
        },
      ]}
    >
      <View style={styles.titleTopWrap}>
        <View>
          <View style={styles.birthdayTextWrap}>
            <Text bold center size={26} style={styles.birthdayText}>
              {t('birthdayCipa')}
            </Text>
          </View>

          <Background24 height={118} width={260} />
        </View>

        <Image
          resizeMode="contain"
          source={background20}
          style={styles.cakeImage}
        />
      </View>

      <Text center marginTop={100}>
        {t('scrollDownToLearnAboutBirthdayCipa')}
      </Text>

      <View style={styles.arrowDownWrap}>
        <View style={styles.background17Wrap}>
          <Image
            resizeMode="contain"
            source={background17}
            style={styles.background17}
          />
        </View>

        <ArrowDown />
      </View>

      <View style={styles.background11Wrap}>
        <Background11 width="100%" />
      </View>

      <View style={styles.content}>
        <View style={styles.background7Wrap}>
          <Image
            resizeMode="contain"
            source={background7}
            style={styles.background7}
          />
        </View>

        <View>
          <Text bold center size={28}>
            {t('guestsOfBirthdayCipa')}
          </Text>

          <View style={styles.arrow2Wrap}>
            <Arrow2 />
          </View>
        </View>

        <View style={styles.guestsList}>
          {guests.map((quest, index) => {
            return (
              <View
                key={quest.name}
                style={[
                  styles.guestRow,
                  index % 2 === 0 ? styles.guestRowEven : null,
                ]}
              >
                <quest.image />

                <View style={styles.guestNameWrap}>
                  <Text bold center size={22}>
                    {quest.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.tortCard}>
          <View style={styles.background13Wrap}>
            <Image
              resizeMode="contain"
              source={background13}
              style={styles.background13}
            />
          </View>

          <Text bold center marginTop={160} size={28}>
            {t('cipaGentlyGaveThemATort')}
          </Text>

          <View style={styles.bottomRight}>
            <View>
              <View style={styles.guestsCard}>
                {questsPhrase.map(el => (
                  <View key={el} style={styles.guestsRow}>
                    <View style={styles.guestsDot} />

                    <Text bold color={colors.white} size={18}>
                      {el}
                    </Text>
                  </View>
                ))}
              </View>

              <Image source={background14} style={styles.background14} />
            </View>
          </View>

          <View style={styles.bottomArrowMirrored}>
            <Arrow2 />
          </View>
        </View>

        <View style={styles.purpleCard}>
          <View style={styles.background29Wrap}>
            <Image source={background29} style={styles.background29} />

            <Text bold color={colors.white} size={34} style={styles.numberOne}>
              1
            </Text>

            <Text bold color={colors.white} size={34} style={styles.numberTwo}>
              2
            </Text>

            <Text
              bold
              color={colors.white}
              size={34}
              style={styles.numberFiveLeft}
            >
              5
            </Text>

            <Text
              bold
              color={colors.white}
              size={34}
              style={styles.numberThree}
            >
              3
            </Text>

            <Text
              bold
              color={colors.white}
              size={34}
              style={styles.numberFiveBottom}
            >
              5
            </Text>
          </View>

          <View style={styles.background1Wrap}>
            <Image
              resizeMode="contain"
              source={background1}
              style={styles.background1}
            />
          </View>

          <Text bold center color={colors.white} size={28}>
            {t('oCipaDividedTheCakeInto')}
          </Text>

          <Text
            bold
            center
            color={colors.white}
            size={152}
            style={styles.bigNumber}
          >
            5
          </Text>
        </View>

        <View style={styles.questionSection}>
          <View style={styles.background7Wrap}>
            <Image
              resizeMode="contain"
              source={background7}
              style={styles.background7}
            />
          </View>

          <Text bold center size={24}>
            {t('attentionIHaveAQuestion')}
          </Text>

          <View style={styles.questionArrow}>
            <Arrow2 />
          </View>
        </View>

        <View style={styles.answersCard}>
          <Text bold center size={24}>
            {t('whatPartOfTheCakeWillEachFriendGet')}
          </Text>

          <View style={styles.answersIllustrationWrap}>
            <View style={styles.guestBottomLeft}>
              <Background25 height={58} width={58} />
            </View>

            <View style={styles.guestBottomRight}>
              <Background28 height={58} width={58} />
            </View>

            <View style={styles.guestTopLeftMirrored}>
              <Background26 height={58} width={58} />
            </View>

            <View style={styles.guestTopRight}>
              <Background27 height={58} width={58} />
            </View>

            <Image source={background30} style={styles.background30} />
          </View>

          <View style={styles.answerOptionsWrap}>
            {answerOptions.map(el => {
              const numbers = el.split('/');
              const isSelected = selectedAnswer === el;
              const handleSetAnswer = () => setSelectedAnswer(el);

              return (
                <Button
                  borderRadius={25}
                  pressed={isSelected}
                  size={94}
                  onPress={handleSetAnswer}
                >
                  <Text bold center size={20}>
                    {numbers[0]}
                  </Text>

                  <View style={styles.answerFractionDivider} />

                  <Text bold center size={20}>
                    {numbers[1]}
                  </Text>
                </Button>
              );
            })}
          </View>

          <View
            style={[
              styles.checkButtonWrap,
              {
                marginBottom: DEFAULT_SPACE + bottom,
              },
            ]}
          >
            <Button
              disabled={!selectedAnswer || isLoading}
              isLoading={isLoading}
              title={t('check')}
              onPress={handleGoToNextSlide}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background14: {
    width: 240,
    height: 312,
  },
  background1: {
    width: '100%',
    height: '100%',
  },
  bottomRight: {
    alignItems: 'flex-end',
    marginTop: 50,
    marginBottom: -30,
  },
  bottomArrowMirrored: {
    position: 'absolute',
    bottom: -50,
    left: 100,
    transform: [{ scaleX: -1 }],
  },
  guestsCard: {
    position: 'absolute',
    top: 30,
    left: -70,
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
    transform: [{ rotate: '-7deg' }],
  },
  guestsDot: {
    width: 14,
    height: 14,
    backgroundColor: colors.white,
    borderRadius: 9999,
  },
  guestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowDownWrap: {
    alignItems: 'center',
    marginTop: 30,
  },
  arrow2Wrap: {
    position: 'absolute',
    top: 130,
    right: 20,
  },
  background11Wrap: {
    marginTop: 140,
  },
  background17: {
    width: 130,
  },
  background17Wrap: {
    position: 'absolute',
    top: 0,
    left: -38,
    transform: [{ rotate: '13deg' }],
  },
  background7Wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  background7: {
    width: '100%',
    height: '100%',
  },
  birthdayText: {
    transform: [{ rotate: '-4deg' }],
  },
  birthdayTextWrap: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  cakeImage: {
    position: 'absolute',
    right: '8%',
    bottom: -80,
    zIndex: 3,
    width: 97,
    transform: [{ rotate: '14deg' }],
  },
  content: {
    backgroundColor: colors.pink,
  },
  guestNameWrap: {
    width: '50%',
  },
  guestRow: {
    paddingHorizontal: DEFAULT_SPACE * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestRowEven: {
    flexDirection: 'row-reverse',
  },
  guestsList: {
    gap: DEFAULT_SPACE,
    marginTop: 80,
  },
  root: {
    marginHorizontal: -DEFAULT_SPACE,
  },
  titleTopWrap: {
    alignItems: 'center',
  },
  background13Wrap: {
    position: 'absolute',
    top: -256 / 2,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  background13: {
    width: 256,
    height: 256,
  },
  background1Wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tortCard: {
    backgroundColor: colors.white,
    borderRadius: 70,
    marginTop: 200,
    zIndex: 2,
  },
  purpleCard: {
    backgroundColor: colors.brightPurple,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    marginTop: -200,
    paddingTop: 300,
    paddingBottom: 180,
  },
  background29Wrap: {
    position: 'absolute',
    left: 0,
    width: '100%',
    bottom: -150,
    zIndex: 2,
    alignItems: 'center',
  },
  background29: {
    width: 300,
    height: 300,
  },
  numberOne: {
    position: 'absolute',
    top: -20,
    left: '18%',
  },
  numberTwo: {
    position: 'absolute',
    top: -20,
    right: '18%',
  },
  numberFiveLeft: {
    position: 'absolute',
    bottom: 70,
    left: '6%',
  },
  numberThree: {
    position: 'absolute',
    bottom: 70,
    right: '6%',
  },
  numberFiveBottom: {
    position: 'absolute',
    bottom: -50,
    right: '50%',
    transform: [{ translateX: '50%' }],
  },
  bigNumber: {
    lineHeight: Platform.OS === 'ios' ? undefined : 152,
  },
  questionSection: {
    paddingTop: 220,
  },
  questionArrow: {
    position: 'absolute',
    bottom: -70,
    left: 40,
    transform: [{ scaleX: -1 }],
    zIndex: 2,
  },
  answersCard: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: colors.white,
    paddingTop: DEFAULT_SPACE * 2,
    marginTop: 40,
  },
  answersIllustrationWrap: {
    marginTop: 66,
    alignItems: 'center',
    marginBottom: 50,
  },
  guestBottomLeft: {
    position: 'absolute',
    left: '7%',
    bottom: 20,
  },
  guestBottomRight: {
    position: 'absolute',
    right: '7%',
    bottom: 20,
  },
  guestTopLeftMirrored: {
    position: 'absolute',
    left: '15%',
    top: -20,
    transform: [{ scaleX: -1 }],
  },
  guestTopRight: {
    position: 'absolute',
    right: '15%',
    top: -20,
  },
  background30: {
    width: 210,
    height: 208,
  },
  answerOptionsWrap: {
    flexDirection: 'row',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: '20%',
    marginBottom: 46,
  },
  answerFractionDivider: {
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
    width: '50%',
  },
  checkButtonWrap: {
    paddingHorizontal: DEFAULT_SPACE,
  },
});
