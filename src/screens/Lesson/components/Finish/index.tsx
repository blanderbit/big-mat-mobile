import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';
import { HomeStackNavigationProp } from '@navigation/extra/types';

import { API } from '@API/index';
import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { useLessonsStore } from '@stores/lessonsStore';
import { useUserStore } from '@stores/userStore';

import background7 from '@assets/images/background7.png';
import finishCake from '@assets/images/finishCake.png';

type Props = {
  lessonId: string;
};

export const Finish = ({ lessonId }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeStackNavigationProp>();
  const [points, setPoints] = useState(0);
  const setCurrentSlideIndex = useLessonsStore(
    state => state.setCurrentSlideIndex,
  );
  const getTotalScore = useUserStore(s => s.getTotalScore);
  const [isLoading, setIsLoading] = useState(true);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    const completeRoute = async () => {
      setIsLoading(true);

      try {
        const res = await API.post(
          `/v1/progress/routes/${lessonId}/complete`,
          { routeId: lessonId },
        );

        const score = res.data?.data?.progress?.score;
        if (typeof score === 'number') {
          setPoints(score);
        }

        // Persist score in app state as soon as the result screen is shown,
        // so leaving without pressing a button still keeps completion + points.
        await getTotalScore();
      } catch {
        hasCompletedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    void completeRoute();
  }, [getTotalScore, lessonId]);

  const handlePassAgain = () => {
    hasCompletedRef.current = false;
    setCurrentSlideIndex(0);
  };

  const handleGoToRoutes = () => {
    setCurrentSlideIndex(0);
    navigation.pop(2);
  };

  return (
    <Wrapper backgroundColor={colors.pink}>
      <View style={styles.root}>
        <View>
          <View style={styles.background7Wrap}>
            <Image
              resizeMode="contain"
              source={background7}
              style={styles.background7}
            />
          </View>

          <Text center color={colors.white} size={36}>
            {t('result')}:
          </Text>

          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          ) : (
            <Text
              bold
              center
              color={colors.white}
              marginBottom={-22}
              size={106}
            >
              {points}
            </Text>
          )}
        </View>

        {!isLoading && (
          <View style={styles.cakeWrap}>
            <Image
              resizeMode="contain"
              source={finishCake}
              style={styles.cake}
            />
          </View>
        )}

        {!isLoading && (
          <View style={styles.buttons}>
            <Button title={t('passAgain')} onPress={handlePassAgain} />
            <Button title={t('backToRoutes')} onPress={handleGoToRoutes} />
          </View>
        )}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
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
  cake: {
    width: 247,
    height: 239,
  },
  cakeWrap: {
    alignItems: 'center',
  },
  buttons: {
    gap: DEFAULT_SPACE,
  },
  loading: {
    alignItems: 'center',
    marginTop: DEFAULT_SPACE,
  },
  root: {
    justifyContent: 'space-between',
    flex: 1,
  },
});
