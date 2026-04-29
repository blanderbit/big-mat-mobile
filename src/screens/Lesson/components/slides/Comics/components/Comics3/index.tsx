import { Image, Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

import Arrow5 from '@assets/images/arrow5.svg';
import ArrowDown from '@assets/images/arrowDown.svg';
import background7 from '@assets/images/background7.png';
import Background11 from '@assets/images/background11.svg';
import Background25 from '@assets/images/background25.svg';
import Background31 from '@assets/images/background31.svg';
import background32 from '@assets/images/background32.png';
import Eyes from '@assets/images/eyes.svg';
import Notch from '@assets/images/notch.svg';
import Notch3 from '@assets/images/notch3.svg';

type Props = {
  lessonId: string;
  slide: Slide<SlideType.COMIC>;
};

export const Comics3 = ({ lessonId, slide }: Props) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect: true,
    lessonId,
    slideId: slide.id,
  });

  return (
    <View
      style={[
        styles.root,
        {
          marginBottom: -bottom - DEFAULT_SPACE,
        },
      ]}
    >
      <Text center size={30}>
        {t('comics')}
      </Text>

      <Text center size={30}>
        {t('part')} 1
      </Text>

      <View style={styles.background31Section}>
        <Background31 height={92} width={317} />

        <View style={styles.numeratorDenominatorTitleWrap}>
          <Text bold size={24}>
            {t('numeratorAndDenominator')}
          </Text>
        </View>

        <View style={styles.oneWithEyesWrap}>
          <Text bold color={colors.brightPurple} size={100}>
            1
          </Text>

          <View style={styles.eyesOnOne}>
            <Eyes />
          </View>
        </View>
      </View>

      <Text center marginTop={40}>
        {t('scrollDownToReadTheComic')}
      </Text>

      <View style={styles.arrowDownSection}>
        <ArrowDown />

        <View style={styles.twoWithEyesWrap}>
          <View style={styles.eyesOnTwo}>
            <Eyes />
          </View>

          <Text bold color={colors.brightOrange} size={100}>
            2
          </Text>
        </View>
      </View>

      <Background11 width="100%" />

      <View style={styles.content}>
        <Text
          bold
          center
          marginBottom={DEFAULT_SPACE * 2}
          size={24}
          style={styles.comicIntroText}
        >
          {t('helloTodayWeWillRevealTheMysteryOfFractions')}
        </Text>

        <View style={styles.background7Wrap}>
          <Image
            resizeMode="contain"
            source={background7}
            style={styles.background7}
          />
        </View>

        <View style={styles.characterRow}>
          <Background25 />

          <View style={styles.speechBubble}>
            <View style={styles.speechBubbleNotch}>
              <Notch />
            </View>

            <Text bold color={colors.white} size={20}>
              {t('lookAtThisFractionItHasTwoParts')}
            </Text>
          </View>
        </View>

        <View style={styles.fractionCard}>
          <View>
            <Text
              bold
              center
              color={colors.brightPurple}
              marginBottom={Platform.OS === 'ios' ? -12 : -20}
              size={100}
            >
              1
            </Text>

            <View style={styles.eyesOnFractionOne}>
              <Eyes />
            </View>

            <View style={styles.numeratorArrowWrap}>
              <Arrow5 />

              <Text semiBold size={14}>
                {t('numerator')}
              </Text>
            </View>
          </View>

          <View style={styles.fractionDivider} />

          <View>
            <Text
              bold
              center
              color={colors.brightOrange}
              size={100}
              style={styles.fractionTwo}
            >
              2
            </Text>

            <View style={styles.eyesOnFractionTwo}>
              <Eyes />
            </View>

            <View style={styles.denominatorArrowWrap}>
              <View style={styles.arrow5Mirrored}>
                <Arrow5 />
              </View>

              <Text semiBold size={14}>
                {t('denominator')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.fractionWordOriginCard}>
          <View style={styles.background32Wrap}>
            <Image source={background32} style={styles.background32} />
          </View>

          <Text bold center size={28}>
            {t('fractionWordOrigin')}
          </Text>
        </View>

        <View style={styles.fractionDefinitionCard}>
          <Text bold center color={colors.white} size={20}>
            {t('fractionDefinition')}
          </Text>
        </View>

        <View style={styles.numeratorDenominatorCard}>
          <View style={styles.background7Wrap}>
            <Image
              resizeMode="contain"
              source={background7}
              style={styles.background7}
            />
          </View>

          <View>
            <Text bold center size={20}>
              {t('numeratorAtTheTop')}
            </Text>

            <View style={styles.numeratorBubble}>
              <Text bold center color={colors.white} size={20}>
                {t('iShowYouHowManyPartsYouHaveTaken')}
              </Text>

              <View style={styles.numeratorNotchWrap}>
                <Notch3 />
              </View>
            </View>

            <View>
              <Text
                bold
                center
                color={colors.brightPurple}
                marginBottom={Platform.OS === 'ios' ? -12 : -20}
                size={100}
              >
                1
              </Text>

              <View style={styles.eyesOverOneCentered}>
                <Eyes />
              </View>
            </View>
          </View>

          <View style={styles.fractionDivider} />

          <View>
            <View>
              <Text
                bold
                center
                color={colors.brightOrange}
                size={100}
                style={styles.fractionTwo}
              >
                2
              </Text>

              <View style={styles.eyesOverTwoCentered}>
                <Eyes />
              </View>
            </View>

            <View style={styles.denominatorBubble}>
              <View style={styles.denominatorNotchWrap}>
                <Notch3 />
              </View>

              <Text bold center color={colors.white} size={20}>
                {t('iShowYouHowManyPartsYouHaveDividedTheWholeInto')}
              </Text>
            </View>
          </View>

          <Text bold center size={20} style={styles.denominatorTitle}>
            {t('denominatorAtTheBottom')}
          </Text>
        </View>

        <Button
          isLoading={isLoading}
          marginBottom={DEFAULT_SPACE + bottom}
          title={t('continue')}
          onPress={handleGoToNextSlide}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: -DEFAULT_SPACE,
  },
  background31Section: {
    alignItems: 'center',
    marginTop: DEFAULT_SPACE,
  },
  numeratorDenominatorTitleWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 8,
    left: 16,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  oneWithEyesWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -50 : -60,
    right: '14%',
    transform: [{ rotate: '12deg' }],
  },
  eyesOnOne: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 28 : 50,
    left: -10,
  },
  arrowDownSection: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 93,
  },
  twoWithEyesWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -40 : -60,
    left: DEFAULT_SPACE,
    transform: [{ rotate: '-10deg' }],
  },
  eyesOnTwo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 28 : 50,
    left: 0,
    zIndex: 2,
  },
  content: {
    backgroundColor: colors.pink,
    paddingHorizontal: DEFAULT_SPACE,
  },
  comicIntroText: {
    zIndex: 2,
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
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speechBubble: {
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
    borderRadius: 18,
  },
  speechBubbleNotch: {
    position: 'absolute',
    top: 20,
    left: -20,
    justifyContent: 'center',
  },
  fractionCard: {
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: '#DE90D2',
    marginTop: 50,
    marginHorizontal: DEFAULT_SPACE,
    marginBottom: 112,
  },
  eyesOnFractionOne: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 50,
    left: -15,
  },
  fractionDivider: {
    borderBottomWidth: 8,
    borderBottomColor: colors.black,
    width: 140,
  },
  numeratorBubble: {
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
    borderRadius: 18,
    marginTop: DEFAULT_SPACE,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  numeratorNotchWrap: {
    position: 'absolute',
    bottom: -20,
    left: 12,
    width: '100%',
    alignItems: 'center',
  },
  fractionTwo: {
    lineHeight: Platform.OS === 'ios' ? 110 : 100,
  },
  eyesOnFractionTwo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 20,
    left: 0,
  },
  eyesOverOneCentered: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 48,
    right: '50%',
    transform: [{ translateX: 16 }],
  },
  eyesOverTwoCentered: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 28,
    right: '50%',
    transform: [{ translateX: 16 }],
  },
  numeratorArrowWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 48,
    right: '-32%',
  },
  denominatorArrowWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 48,
    left: '-32%',
  },
  arrow5Mirrored: {
    transform: [{ scaleX: -1 }],
  },
  fractionWordOriginCard: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: colors.white,
    paddingTop: 144,
    marginHorizontal: -DEFAULT_SPACE,
    paddingBottom: 160,
  },
  background32Wrap: {
    position: 'absolute',
    top: -(310 / 2),
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  background32: {
    width: 310,
    height: 310,
  },
  fractionDefinitionCard: {
    backgroundColor: colors.brightPurple,
    borderRadius: 70,
    paddingVertical: 56,
    paddingHorizontal: 20,
    marginHorizontal: -DEFAULT_SPACE,
    marginTop: -100,
  },
  numeratorDenominatorCard: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 50,
    marginHorizontal: DEFAULT_SPACE,
    marginBottom: 80,
  },
  denominatorTitle: {
    marginTop: Platform.OS === 'ios' ? -10 : 0,
  },
  denominatorBubble: {
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
    borderRadius: 18,
    marginTop: Platform.OS === 'ios' ? DEFAULT_SPACE : 26,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  denominatorNotchWrap: {
    position: 'absolute',
    top: -20,
    left: 12,
    width: '100%',
    alignItems: 'center',
    transform: [{ scaleY: -1 }],
  },
});
