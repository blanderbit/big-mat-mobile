import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@components/Pressable';

import { colors } from '@extra/colors';
import { DEFAULT_OPACITY, DEFAULT_SPACE } from '@extra/constants';
import { useLessonsStore } from '@stores/lessonsStore';

import BackArrow from '@assets/images/backArrow.svg';
import Lightning from '@assets/images/lightning.svg';

export const LessonHeader = () => {
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();
  const slides = useLessonsStore(s => s.slides);
  const currentSlideIndex = useLessonsStore(s => s.currentSlideIndex);

  const currentSlide = slides[currentSlideIndex];

  const progress =
    slides.length === 0
      ? 0
      : Math.min(
          100,
          Math.max(0, ((currentSlideIndex + 1) / slides.length) * 100),
        );

  return (
    <View style={[styles.container, { paddingTop: top + DEFAULT_SPACE }]}>
      <Pressable style={styles.backButton} onPress={goBack}>
        <BackArrow />
      </Pressable>

      {currentSlide && (
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack} />

          <View style={[styles.progressFill, { width: `${progress}%` }]} />

          <View style={[styles.progressIconRail, { width: `${progress}%` }]}>
            <Lightning />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DEFAULT_SPACE,
    paddingBottom: DEFAULT_SPACE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: DEFAULT_SPACE,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
  },
  progressWrap: {
    flex: 1,
    height: 10,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    backgroundColor: colors.white,
    opacity: DEFAULT_OPACITY,
    borderRadius: 45,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderRadius: 45,
    height: '100%',
  },
  progressIconRail: {
    position: 'absolute',
    left: 6,
    top: -10,
    bottom: 0,
    height: '100%',
    alignItems: 'flex-end',
  },
});
