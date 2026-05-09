import { Image, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
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
import BackArrow from '@assets/images/backArrow.svg';

type Props = {
  route: RouteProp<HomeStackParamList, typeof routes.home.START_LESSON>;
};

export const StartLesson = ({ route }: Props) => {
  const { lesson } = route.params;
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation<HomeStackNavigationProp>();
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
      <Pressable
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[styles.backButton, { top: top + DEFAULT_SPACE }]}
        onPress={goBack}
      >
        <BackArrow />
      </Pressable>

      <Text
        bold
        center
        color={colors.white}
        marginBottom={lesson.subtitle ? DEFAULT_SPACE : 0}
        marginTop={top + DEFAULT_SPACE}
        size={30}
      >
        {lesson.title}
      </Text>

      {lesson.subtitle && (
        <Text center color={colors.white} size={30}>
          {lesson.subtitle}
        </Text>
      )}

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
  backButton: {
    position: 'absolute',
    left: DEFAULT_SPACE,
    backgroundColor: colors.white,
    width: 30,
    height: 30,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
    zIndex: 3,
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
