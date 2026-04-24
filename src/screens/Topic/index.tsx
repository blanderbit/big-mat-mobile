import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
import { RoundSlider } from '@components/RoundSlider';
import { ScrollView } from '@components/ScrollView';
import { Text } from '@components/Text';
import { routes } from '@navigation/extra/routes';
import { HomeStackParamList } from '@navigation/extra/types';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

import ActiveLessonButton from '@assets/images/activeLessonButton.svg';
import Background10 from '@assets/images/background10.svg';
import InactiveLessonButton from '@assets/images/inactiveLessonButton.svg';
import lock2 from '@assets/images/lock2.png';
import Tooltip1 from '@assets/images/tooltip1.svg';
import Tooltip1Notch from '@assets/images/tooltip1Notch.svg';

type Props = {
  route: RouteProp<HomeStackParamList, typeof routes.home.TOPIC>;
};

export const Topic = ({ route }: Props) => {
  const { t } = useTranslation();
  const { lessons } = route.params;
  const { bottom } = useSafeAreaInsets();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState(0);

  const sortedLessons = lessons.slice().sort((a, b) => {
    const aLocked = a.locked === true;
    const bLocked = b.locked === true;

    if (aLocked !== bLocked) {
      return aLocked ? 1 : -1;
    }

    return a.order - b.order;
  });

  const handleSetContainerWidth = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const contentWidth = containerWidth || screenWidth;

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      scrollViewStyle={styles.scrollView}
      onLayout={handleSetContainerWidth}
    >
      <Text bold center color={colors.white} size={24}>
        {sortedLessons.find(lesson => lesson.progress.status !== 'not_started')
          ? t('youAreDoingGreat')
          : t('startMasteringThisTopic')}
      </Text>

      <View style={styles.lessonsContainer}>
        {sortedLessons.map((lesson, index) => {
          const isLeft = (index + 1) % 2 === 1;
          const isLast = index === sortedLessons.length - 1;
          const firstLocked =
            sortedLessons.findIndex(lesson => lesson.locked) === index;

          return (
            <View key={lesson.id} style={styles.lessonItem}>
              {firstLocked && (
                <View
                  pointerEvents="box-none"
                  style={styles.firstLockedTooltip}
                >
                  <Tooltip1 />

                  <View
                    pointerEvents="auto"
                    style={styles.firstLockedTooltipContent}
                  >
                    <Text bold size={20}>
                      {index + 1}. {lesson.title}
                    </Text>

                    <Button title={t('start')} onPress={() => {}} />
                  </View>
                </View>
              )}

              <View
                style={[
                  styles.lessonButtonWrapper,
                  isLeft ? styles.lessonButtonLeft : styles.lessonButtonRight,
                  firstLocked ? styles.lessonButtonWrapperOnTop : null,
                ]}
              >
                <Pressable onPress={() => {}}>
                  {firstLocked && (
                    <View
                      pointerEvents="none"
                      style={styles.firstLockedTooltipNotch}
                    >
                      <Tooltip1Notch />
                    </View>
                  )}

                  {lesson.locked ? (
                    <View>
                      <InactiveLessonButton />

                      <View style={styles.inactiveOverlay}>
                        <Text
                          bold
                          color={colors.white}
                          size={26}
                          style={styles.inactiveIndexText}
                        >
                          {index + 1}
                        </Text>
                      </View>

                      <View style={styles.lockOverlay}>
                        <Image
                          resizeMode="contain"
                          source={lock2}
                          style={styles.lockIcon}
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <ActiveLessonButton />

                      <View style={styles.inactiveOverlay}>
                        <Text
                          bold
                          color={colors.white}
                          size={26}
                          style={styles.inactiveIndexText}
                        >
                          {index + 1}
                        </Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>

              {isLast ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.finishTooltip,
                    isLeft
                      ? styles.finishTooltipRightOfLesson
                      : styles.finishTooltipLeftOfLesson,
                  ]}
                >
                  <View
                    style={[
                      styles.finishTooltipNotch,
                      isLeft
                        ? styles.finishTooltipNotchLeft
                        : styles.finishTooltipNotchRight,
                    ]}
                  />
                  <View style={styles.finishTooltipBubble}>
                    <Text bold center color={colors.white} size={18}>
                      {t('finish')}
                    </Text>
                  </View>
                </View>
              ) : null}

              {!isLast && (
                <Svg
                  height={20}
                  pointerEvents="none"
                  width={70}
                  style={[
                    styles.connectorBase,
                    isLeft ? styles.connectorLeft : styles.connectorRight,
                  ]}
                >
                  <Line
                    stroke={colors.white}
                    strokeDasharray={lesson.locked ? '6 6' : undefined}
                    strokeWidth={3}
                    x1={0}
                    x2={70}
                    y1={10}
                    y2={10}
                  />
                </Svg>
              )}
            </View>
          );
        })}
      </View>

      <Text
        bold
        center
        color={colors.white}
        marginTop={DEFAULT_SPACE * 2}
        size={28}
      >
        {t('youAreSuper.YouHaveAlreadyMastered')}
      </Text>

      <RoundSlider
        marginBottom={bottom}
        marginHorizontal={DEFAULT_SPACE}
        marginTop={DEFAULT_SPACE}
        tooltipText="6 рівнів з 8"
        value={50}
      />

      <View
        style={[
          styles.background,
          {
            width: contentWidth,
            height: screenHeight,
          },
        ]}
      >
        <Background10
          height="100%"
          preserveAspectRatio="xMinYMin slice"
          width="100%"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  lessonsContainer: {
    gap: 30,
    marginTop: DEFAULT_SPACE * 2,
  },
  lessonItem: {
    position: 'relative',
  },
  lessonButtonWrapper: {
    position: 'relative',
  },
  lessonButtonWrapperOnTop: {
    zIndex: 3,
    elevation: 3,
  },
  firstLockedTooltip: {
    position: 'absolute',
    bottom: 93,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  firstLockedTooltipNotch: {
    position: 'absolute',
    top: -10.2,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 4,
    elevation: 4,
  },
  firstLockedTooltipContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DEFAULT_SPACE / 2,
    paddingHorizontal: DEFAULT_SPACE,
  },
  lessonButtonLeft: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  lessonButtonRight: {
    alignSelf: 'flex-end',
    marginRight: '10%',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  inactiveIndexText: {
    textShadowColor: '#D7D716',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  lockIcon: {
    height: 37,
  },
  connectorBase: {
    position: 'absolute',
    // центрируем по вертикали ровно посередине gap (gap=30 => 15)
    bottom: -15,
  },
  connectorLeft: {
    left: '50%',
    transform: [{ translateX: -35 }, { rotate: '38deg' }],
  },
  connectorRight: {
    left: '50%',
    transform: [{ translateX: -35 }, { rotate: '-38deg' }],
  },
  finishTooltip: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  finishTooltipLeftOfLesson: {
    right: '45%',
  },
  finishTooltipRightOfLesson: {
    left: '45%',
  },
  finishTooltipBubble: {
    backgroundColor: colors.darkBlue,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 4,
    height: 40,
    justifyContent: 'center',
  },
  finishTooltipNotch: {
    position: 'absolute',
    top: '50%',
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ translateY: -10 }],
  },
  finishTooltipNotchLeft: {
    left: -10,
    borderRightWidth: 12,
    borderRightColor: colors.darkBlue,
  },
  finishTooltipNotchRight: {
    right: -10,
    borderLeftWidth: 12,
    borderLeftColor: colors.darkBlue,
  },
  background: {
    position: 'absolute',
    top: -150,
    left: -DEFAULT_SPACE,
    zIndex: -1,
  },
});
