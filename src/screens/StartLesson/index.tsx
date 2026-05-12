import { Image, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { routes } from '@navigation/extra/routes';
import {
  HomeStackNavigationProp,
  HomeStackParamList,
} from '@navigation/extra/types';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { useLessonsStore } from '@stores/lessonsStore';

import background1 from '@assets/images/background1.png';
import Background11 from '@assets/images/background11.svg';

type Props = {
  route: RouteProp<HomeStackParamList, typeof routes.home.START_LESSON>;
};

export const StartLesson = ({ route }: Props) => {
  const { lesson, lessonIndex } = route.params;
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { navigate } = useNavigation<HomeStackNavigationProp>();
  const setCurrentSlideIndex = useLessonsStore(
    state => state.setCurrentSlideIndex,
  );

  const navigateToLesson = () => {
    setCurrentSlideIndex(0);
    navigate(routes.home.LESSON, {
      lessonId: lesson.id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text bold center color={colors.white} size={30}>
          {t('lesson')} {lessonIndex}
        </Text>

        <Text
          center
          color={colors.white}
          marginBottom={lesson.subtitle ? DEFAULT_SPACE : 0}
          size={30}
        >
          {lesson.title}
        </Text>
      </View>

      <View
        style={[styles.startButtonWrap, { bottom: bottom + DEFAULT_SPACE }]}
      >
        <Button title={t('letsStart')} onPress={navigateToLesson} />
      </View>

      <Image
        resizeMode="contain"
        source={background1}
        style={[styles.background1, { marginTop: top + DEFAULT_SPACE }]}
      />

      <View style={styles.bottomBackground}>
        <Background11 width="100%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_SPACE,
  },
  titleBlock: {
    position: 'absolute',
    top: '18%',
    left: 0,
    right: 0,
  },
  startButtonWrap: {
    position: 'absolute',
    paddingHorizontal: DEFAULT_SPACE,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  background1: {
    width: '100%',
    height: '70%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    marginHorizontal: -DEFAULT_SPACE,
  },
  bottomBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
