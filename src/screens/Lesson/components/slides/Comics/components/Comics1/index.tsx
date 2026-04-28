import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_OPACITY, DEFAULT_SPACE } from '@extra/constants';
import { useLessonsStore } from '@stores/lessonsStore';

import Arrow2 from '@assets/images/arrow2.svg';
import Arrow3 from '@assets/images/arrow3.svg';
import Arrow4 from '@assets/images/arrow4.svg';
import ArrowDown from '@assets/images/arrowDown.svg';
import background1 from '@assets/images/background1.png';
import background7 from '@assets/images/background7.png';
import Background11 from '@assets/images/background11.svg';
import background13 from '@assets/images/background13.png';
import background14 from '@assets/images/background14.png';
import Background15 from '@assets/images/background15.svg';
import background16 from '@assets/images/background16.png';
import background17 from '@assets/images/background17.png';
import background18 from '@assets/images/background18.png';
import background19 from '@assets/images/background19.png';
import background20 from '@assets/images/background20.png';
import Background21 from '@assets/images/background21.svg';
import Background22 from '@assets/images/background22.svg';
import Background23 from '@assets/images/background23.svg';
import BlueStar from '@assets/images/blueStar.svg';
import Galka from '@assets/images/galka.svg';
import Lightning from '@assets/images/lightning.svg';
import Lock from '@assets/images/lock.svg';
import Notch from '@assets/images/notch.svg';
import PinkStar from '@assets/images/pinkStar.svg';
import Unlock from '@assets/images/unlock.svg';

export const Comics1 = () => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const goToNextSlide = useLessonsStore(state => state.goToNextSlide);

  const answer = async () => {
    // TODO: add answer logic
    goToNextSlide();
  };

  const questsPhrase = [
    t('guestsAlready'),
    t('guestsAreOnTheWay'),
    t('letsHurryUp'),
  ];

  const cakes = [
    {
      icon: Galka,
      image: background16,
      starsAmount: 1,
      starColor: 'blue',
      word: t('ready'),
      imageHeight: 60,
    },
    {
      icon: Unlock,
      image: background17,
      starsAmount: 2,
      starColor: 'pink',
      word: t('open'),
      imageHeight: 76,
    },
    {
      icon: Lock,
      image: background18,
      starsAmount: 3,
      starColor: 'pink',
      word: t('soon'),
      imageHeight: 77,
    },
    {
      icon: Lock,
      image: background19,
      starsAmount: 4,
      starColor: 'pink',
      word: t('soon'),
      imageHeight: 84,
    },
    {
      icon: Lock,
      image: background20,
      starsAmount: 5,
      starColor: 'pink',
      word: t('soon'),
      imageHeight: 87,
    },
  ];

  return (
    <View
      style={[
        styles.root,
        {
          marginBottom: -bottom - DEFAULT_SPACE,
        },
      ]}
    >
      <Background11 width="100%" />

      <View style={styles.content}>
        <Text bold center marginBottom={DEFAULT_SPACE * 2} size={24}>
          {t('happyBirthday')}
        </Text>

        <Text center>{t('scrollDown')}</Text>

        <View style={styles.arrowDownWrap}>
          <ArrowDown />
        </View>

        <View style={styles.scene}>
          <View style={styles.background7Wrap}>
            <Image
              resizeMode="contain"
              source={background7}
              style={styles.background7}
            />
          </View>

          <Background21 width="40%" />

          <View style={styles.bubble}>
            <View style={styles.notchWrap}>
              <Notch />
            </View>

            <Text bold color={colors.white} size={20}>
              {t('willYouHelpMeWithTheParty')}
            </Text>
          </View>

          <Text bold center marginTop={80} size={20}>
            {t('allSimple')}
          </Text>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.background13Wrap}>
            <Image
              resizeMode="contain"
              source={background13}
              style={styles.background13}
            />

            <View style={styles.arrow2}>
              <Arrow2 />
            </View>
          </View>

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

              <Image
                resizeMode="contain"
                source={background14}
                style={styles.background14}
              />
            </View>
          </View>

          <Text bold center size={24}>
            {t('onlyAtTheEnd')}
          </Text>
        </View>

        <View style={styles.purpleSection}>
          <View style={styles.background1Wrap}>
            <Image
              resizeMode="contain"
              source={background1}
              style={styles.background1}
            />
          </View>

          <View style={styles.totalRow}>
            <Background22 width={157} />

            <View style={styles.totalCard}>
              <View style={styles.background23Wrap}>
                <Background23 />
              </View>

              <Text semiBold size={18}>
                {t('totalLevels')}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.background7Wrap}>
            <Image
              resizeMode="contain"
              source={background7}
              style={styles.background7}
            />
          </View>

          <Text bold center marginTop={72} size={24}>
            {t('firstLevels')}
          </Text>

          <View style={styles.arrow2Wrap}>
            <Arrow2 />
          </View>
        </View>

        <View style={styles.cakesGrid}>
          <View style={styles.cakesBg}>
            <View style={styles.cakesDivider} />

            <View style={styles.background15Wrap}>
              <Background15 />
            </View>

            <View style={styles.lightningWrap}>
              <Lightning />
            </View>
          </View>

          {cakes.map((el, index) => (
            <View
              key={el.image.toString()}
              style={[
                styles.cakeCard,
                index % 2 === 0 ? styles.cakeCardLeft : styles.cakeCardRight,
                index === 0 ? null : styles.cakeCardOffset,
                index === cakes.length - 1 ? styles.cakeCardLast : null,
              ]}
            >
              {index === cakes.length - 1 && (
                <View style={styles.starTasksWrap}>
                  <View style={styles.starTasksCard}>
                    <Text bold color={colors.white} size={18}>
                      {t('starTasks')}
                    </Text>
                  </View>
                </View>
              )}

              {index === 0 && (
                <View style={styles.arrowRight}>
                  <Arrow3 />
                </View>
              )}

              {index % 2 !== 0 && (
                <View style={styles.arrowLeft}>
                  <Arrow4 />
                </View>
              )}

              {index % 2 === 0 && index !== 0 && index !== cakes.length - 1 && (
                <View style={styles.arrowRightMirrored}>
                  <Arrow4 />
                </View>
              )}

              <View style={styles.cakeInner}>
                <View style={styles.cakeRow}>
                  <el.icon />

                  <Text
                    size={12}
                    style={[
                      styles.cakeWord,
                      index === 0 ? styles.cakeWordOpaque : styles.cakeWordDim,
                    ]}
                  >
                    {el.word}
                  </Text>
                </View>

                <Image
                  resizeMode="contain"
                  source={el.image}
                  style={[styles.cakeImage, { height: el.imageHeight }]}
                />

                <View style={styles.cakeRow}>
                  {Array.from({ length: el.starsAmount }).map((_, index) =>
                    el.starColor === 'blue' ? (
                      <BlueStar key={index} />
                    ) : (
                      <PinkStar key={index} />
                    ),
                  )}
                </View>
              </View>

              <View
                style={[
                  styles.cakeOverlay,
                  index === 0 ? styles.cakeOverlayGlow : null,
                  index === 0
                    ? styles.cakeOverlayOpaque
                    : styles.cakeOverlayDim,
                ]}
              />
            </View>
          ))}
        </View>

        <Button
          marginBottom={DEFAULT_SPACE + bottom}
          marginTop={DEFAULT_SPACE * 2}
          title={t('helpCipa')}
          onPress={answer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowDownWrap: {
    alignItems: 'center',
  },
  cakeCard: {
    width: '46%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cakeCardLeft: {
    alignSelf: 'flex-start',
  },
  cakeCardRight: {
    alignSelf: 'flex-end',
  },
  cakesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 80,
  },
  cakeOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRadius: 15,
  },
  cakeOverlayGlow: {
    shadowColor: colors.white,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
  bubble: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
    borderRadius: 18,
  },
  arrow2: {
    position: 'absolute',
    top: -40,
    right: 25,
  },
  arrow2Wrap: {
    alignSelf: 'flex-end',
    marginTop: 37,
    paddingRight: '20%',
  },
  arrowLeft: {
    position: 'absolute',
    top: '50%',
    left: '-60%',
  },
  arrowRight: {
    position: 'absolute',
    top: '50%',
    right: '-60%',
  },
  arrowRightMirrored: {
    position: 'absolute',
    top: '50%',
    right: '-60%',
    transform: [{ scaleX: -1 }],
  },
  cakesBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  cakesDivider: {
    height: '100%',
    borderRightWidth: 3,
    borderColor: '#E69BD9',
    borderStyle: 'dashed',
  },
  background15Wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingLeft: 18,
  },
  lightningWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  cakeInner: {
    zIndex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingVertical: DEFAULT_SPACE * 2,
  },
  cakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cakeWord: {},
  cakeImage: {
    width: 80,
  },
  cakeCardOffset: {
    marginTop: 180,
  },
  cakeCardLast: {
    marginTop: 70,
  },
  cakeOverlayDim: {
    opacity: DEFAULT_OPACITY,
  },
  cakeOverlayOpaque: {
    opacity: 1,
  },
  cakeWordDim: {
    opacity: DEFAULT_OPACITY,
  },
  cakeWordOpaque: {
    opacity: 1,
  },
  starTasksCard: {
    borderRadius: 12,
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
  },
  starTasksWrap: {
    position: 'absolute',
    right: '-115%',
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: colors.pink,
    paddingHorizontal: DEFAULT_SPACE,
  },
  background7: {
    width: '100%',
    height: '100%',
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
  background13: {
    width: 256,
    height: 256,
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
  background14: {
    width: 240,
  },
  bottomRight: {
    alignItems: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderRadius: 70,
    marginHorizontal: -DEFAULT_SPACE,
    paddingBottom: 85,
    zIndex: 2,
  },
  guestsCard: {
    position: 'absolute',
    top: 200,
    left: -125,
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
  notchWrap: {
    position: 'absolute',
    top: 0,
    left: -20,
    zIndex: 2,
    height: '100%',
    justifyContent: 'center',
  },
  root: {
    marginHorizontal: -DEFAULT_SPACE,
  },
  scene: {
    marginTop: 90,
    marginBottom: 212,
  },
  background1: {
    width: '100%',
    height: '100%',
  },
  background1Wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  background23Wrap: {
    position: 'absolute',
    top: 23,
    left: -20,
    height: '100%',
  },
  purpleSection: {
    backgroundColor: colors.brightPurple,
    padding: DEFAULT_SPACE,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    marginHorizontal: -DEFAULT_SPACE,
    paddingTop: 300,
    marginTop: -200,
    paddingBottom: 70,
  },
  totalCard: {
    backgroundColor: colors.brightYellow,
    borderRadius: 18,
    padding: DEFAULT_SPACE,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 50,
  },
});
