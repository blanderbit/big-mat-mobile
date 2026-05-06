import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';

import { API } from '@API/index';
import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { useLessonsStore } from '@stores/lessonsStore';

import background7 from '@assets/images/background7.png';
import finishCake from '@assets/images/finishCake.png';

type Props = {
  lessonId: string;
};

export const Finish = ({ lessonId }: Props) => {
  const { t } = useTranslation();
  const [points, setPoints] = useState(0);
  const setCurrentSlideIndex = useLessonsStore(
    state => state.setCurrentSlideIndex,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPoints = async () => {
      setIsLoading(true);
      const res = await API.post(`/v1/progress/routes/${lessonId}/complete`, {
        routeId: lessonId,
      });
      setPoints(res.data.data.progress.score);
      setIsLoading(false);
    };

    getPoints();
  }, [lessonId]);

  const handlePassAgain = () => {
    setCurrentSlideIndex(0);
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
          <Button title={t('passAgain')} onPress={handlePassAgain} />
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
  loading: {
    alignItems: 'center',
    marginTop: DEFAULT_SPACE,
  },
  root: {
    justifyContent: 'space-between',
    flex: 1,
  },
});
