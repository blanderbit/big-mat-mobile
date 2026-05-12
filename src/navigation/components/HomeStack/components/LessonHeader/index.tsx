import { useEffect, useState } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_OPACITY, DEFAULT_SPACE } from '@extra/constants';
import { useLessonsStore } from '@stores/lessonsStore';

import BackArrow from '@assets/images/backArrow.svg';
import Fish from '@assets/images/fish.svg';

export const LessonHeader = () => {
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();
  const { t } = useTranslation();
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

  const [progressAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const handlePressBackButton = () => {
    Alert.alert(t('confirmInterruptLesson'), undefined, [
      { style: 'cancel', text: t('cancel') },
      { onPress: goBack, text: t('yes'), style: 'destructive' },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: top + DEFAULT_SPACE }]}>
      <Pressable style={styles.backButton} onPress={handlePressBackButton}>
        <BackArrow />
      </Pressable>

      {currentSlide && (
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack} />

          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />

          <Animated.View
            style={[styles.progressIconRail, { width: progressWidth }]}
          >
            <Fish />
          </Animated.View>
        </View>
      )}

      {!!slides.length && (
        <Text color={colors.brightPurple} size={12}>
          {currentSlideIndex + 1}/{slides.length}
        </Text>
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
    backgroundColor: colors.white,
    width: 30,
    height: 30,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
    marginRight: DEFAULT_SPACE * 2,
  },
  progressWrap: {
    flex: 1,
    height: 10,
  },
  progressTrack: {
    backgroundColor: colors.white,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    opacity: DEFAULT_OPACITY,
    borderRadius: 45,
  },
  progressFill: {
    backgroundColor: '#5454D1',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 45,
    height: '100%',
  },
  progressIconRail: {
    position: 'absolute',
    left: 6,
    top: -14,
    bottom: 0,
    height: '100%',
    alignItems: 'flex-end',
  },
});
