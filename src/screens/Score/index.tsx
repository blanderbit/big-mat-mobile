import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import { Button } from '@components/Button';
import { RoundSlider } from '@components/RoundSlider';
import { ScrollView } from '@components/ScrollView';
import { Text } from '@components/Text';
import { routes } from '@navigation/extra/routes';
import { HomeStackNavigationProp } from '@navigation/extra/types';

import { API } from '@API/index';
import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

import background4 from '@assets/images/background4.png';
import Background11 from '@assets/images/background11.svg';
import Background33 from '@assets/images/background33.svg';

const MAX_SCORE_FONT = 116;

export const Score = () => {
  const { width: screenWidth } = useWindowDimensions();
  const maxTextWidth = screenWidth - DEFAULT_SPACE * 2;
  const { t } = useTranslation();
  const { width: windowWidth } = Dimensions.get('window');
  const { navigate } = useNavigation<HomeStackNavigationProp>();
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    const getGlobalScore = async () => {
      const response = await API.get('/v1/content/topics/progress');
      const { completedTopics, totalTopics } = response.data.data.summary;
      const percent =
        totalTopics > 0
          ? Math.min(100, Math.max(0, (completedTopics / totalTopics) * 100))
          : 0;
      setGlobalScore(Math.round(percent));
    };
    getGlobalScore();
  }, []);

  const handleShare = () => {};

  const navigateToLesson = () => {
    navigate(routes.home.HOME);
  };

  const fullBleedWidth = { width: windowWidth } as const;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.scoreRow, { maxWidth: maxTextWidth }]}>
        <Text
          adjustsFontSizeToFit
          bold
          center
          color={colors.white}
          minimumFontScale={0.12}
          numberOfLines={1}
          size={MAX_SCORE_FONT}
        >
          {globalScore}
        </Text>
      </View>

      <View style={[styles.whiteCard, fullBleedWidth, styles.whiteCardFirst]}>
        <View style={styles.mascotWrap}>
          <Image
            resizeMode="contain"
            source={background4}
            style={styles.mascotImage}
          />
        </View>

        <Text
          bold
          center
          color={colors.brightPurple}
          marginBottom={DEFAULT_SPACE * 2}
          size={26}
        >
          {globalScore === 0 ? t('topicTitle.empty') : t('topicTitle.middle')}
        </Text>

        <RoundSlider fillColor={colors.brightPurple} value={globalScore} />

        <View style={styles.shareShadowWrap}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.sharePressable,
              pressed ? styles.sharePressablePressed : null,
            ]}
            onPress={handleShare}
          >
            <View style={styles.sharePill}>
              <LinearGradient
                colors={['#7B76E8', '#635BDB']}
                end={{ x: 0.5, y: 1 }}
                start={{ x: 0.5, y: 0 }}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.shareContent}>
                <Text bold center color={colors.white} size={18}>
                  {t('share')}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      <Text center color={colors.white} marginTop={60} size={18}>
        {t('shareDescription')}
      </Text>

      <Button
        marginBottom={60}
        marginTop={60}
        title={t('letsLearn')}
        onPress={navigateToLesson}
      />

      <View style={[styles.whiteCard, fullBleedWidth]}>
        <Text center semiBold size={32}>
          {t('whenMathDoesNotScare')}
        </Text>

        <View style={styles.inspireGraphicWrap}>
          <Background33 />

          <View style={styles.inspireWordOverlay}>
            <Text semiBold color={colors.white} size={32}>
              {t('inspire')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomWaveWrap}>
        <Background11 width={windowWidth} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: DEFAULT_SPACE,
    alignItems: 'center',
  },
  scoreRow: {
    width: '100%',
  },
  whiteCard: {
    borderRadius: 70,
    backgroundColor: colors.white,
    paddingVertical: 35,
    paddingHorizontal: 50,
  },
  whiteCardFirst: {
    marginTop: 140,
  },
  mascotWrap: {
    position: 'absolute',
    top: -192,
    left: DEFAULT_SPACE * 4,
    width: '100%',
    alignItems: 'center',
  },
  mascotImage: {
    width: 250,
    height: 194,
  },
  inspireGraphicWrap: {
    alignItems: 'center',
  },
  inspireWordOverlay: {
    position: 'absolute',
    top: -4,
    left: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-3deg' }],
  },
  bottomWaveWrap: {
    marginBottom: -DEFAULT_SPACE,
    marginTop: -30,
  },
  shareShadowWrap: {
    marginTop: DEFAULT_SPACE * 2,
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: '#635BDB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 6,
  },
  sharePressable: {
    borderRadius: 999,
    height: 40,
  },
  sharePressablePressed: {
    opacity: 0.9,
  },
  sharePill: {
    height: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareContent: {
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
