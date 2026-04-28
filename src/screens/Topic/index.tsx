import { useRef, useState } from 'react';
import {
  findNodeHandle,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
import { ScrollView } from '@components/ScrollView';
import { Text } from '@components/Text';
import { RoundSlider } from '@screens/Topic/components/RoundSlider';
import { routes } from '@navigation/extra/routes';
import {
  HomeStackNavigationProp,
  HomeStackParamList,
} from '@navigation/extra/types';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { pluralizeUk } from '@extra/pluralizeUk';

import ActiveLessonButton from '@assets/images/activeLessonButton.svg';
import Background10 from '@assets/images/background10.svg';
import InactiveLessonButton from '@assets/images/inactiveLessonButton.svg';
import lock2 from '@assets/images/lock2.png';
import Tooltip1Notch from '@assets/images/tooltip1Notch.svg';

type Props = {
  route: RouteProp<HomeStackParamList, typeof routes.home.TOPIC>;
};

export const Topic = ({ route }: Props) => {
  const { t } = useTranslation();
  const { lessons } = route.params;
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { navigate } = useNavigation<HomeStackNavigationProp>();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState(0);
  const [firstLockedTooltipBelow, setFirstLockedTooltipBelow] = useState(false);
  const firstLockedButtonWrapperRef = useRef<View | null>(null);
  const [tooltipIndex, setTooltipIndex] = useState(0);

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
  const TOOLTIP_HEIGHT_ESTIMATE = 230;
  const TOOLTIP_OFFSET_FROM_BUTTON = 90;

  const updateFirstLockedTooltipSide = () => {
    const node =
      firstLockedButtonWrapperRef.current != null
        ? findNodeHandle(firstLockedButtonWrapperRef.current)
        : null;

    if (!node) return;

    UIManager.measureInWindow(node, (_x, buttonY) => {
      // Пытаемся рисовать СВЕРХУ. Если верх тултипа попадает под header — переключаем на СНИЗУ
      const tooltipTopIfAbove =
        buttonY - TOOLTIP_OFFSET_FROM_BUTTON - TOOLTIP_HEIGHT_ESTIMATE;
      const shouldBeBelow = tooltipTopIfAbove < headerHeight;
      setFirstLockedTooltipBelow(prev =>
        prev === shouldBeBelow ? prev : shouldBeBelow,
      );
    });
  };

  const handleCloseTooltip = () => {
    setTooltipIndex(prev => {
      if (prev >= sortedLessons.length - 1) return sortedLessons.length;
      return prev + 1;
    });
  };

  const passedLessonsCount = sortedLessons.filter(
    lesson => !!lesson.progress.completedAt,
  ).length;

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
          const isShowTooltip = index === tooltipIndex;

          const navigateToStartLesson = () => {
            navigate(routes.home.START_LESSON, {
              lesson,
            });
          };

          return (
            <View key={lesson.id} style={styles.lessonItem}>
              {isShowTooltip && (
                <View
                  pointerEvents="box-none"
                  style={[
                    styles.firstLockedTooltip,
                    firstLockedTooltipBelow
                      ? styles.firstLockedTooltipBelow
                      : styles.firstLockedTooltipAbove,
                  ]}
                >
                  <View style={styles.tooltip}>
                    <Text bold size={20}>
                      {index + 1}. {lesson.title}
                    </Text>

                    {lesson.subtitle && (
                      <Text center semiBold size={14}>
                        {lesson.subtitle}
                      </Text>
                    )}

                    <Button title={t('close')} onPress={handleCloseTooltip} />

                    <Button
                      title={t('start')}
                      onPress={navigateToStartLesson}
                    />
                  </View>
                </View>
              )}

              <View
                ref={isShowTooltip ? firstLockedButtonWrapperRef : undefined}
                style={[
                  styles.lessonButtonWrapper,
                  isLeft ? styles.lessonButtonLeft : styles.lessonButtonRight,
                  isShowTooltip ? styles.lessonButtonWrapperOnTop : null,
                ]}
                onLayout={
                  isShowTooltip ? updateFirstLockedTooltipSide : undefined
                }
              >
                <Pressable onPress={() => {}}>
                  {isShowTooltip && (
                    <View
                      style={[
                        styles.notchWrapper,
                        firstLockedTooltipBelow
                          ? styles.notchWrapperBelow
                          : styles.notchWrapperAbove,
                      ]}
                    >
                      <Tooltip1Notch />

                      <View style={styles.notchBorderMask} />
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
        value={(passedLessonsCount / sortedLessons.length) * 100}
        tooltipText={
          passedLessonsCount +
          ' ' +
          pluralizeUk(passedLessonsCount, [
            t('level_one'),
            t('level_few'),
            t('level_many'),
          ]) +
          ' ' +
          t('from') +
          ' ' +
          sortedLessons.length
        }
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
    zIndex: 4,
  },
  firstLockedTooltip: {
    position: 'absolute',
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 3,
    elevation: 10,
  },
  firstLockedTooltipAbove: {
    bottom: 90,
  },
  firstLockedTooltipBelow: {
    top: 90,
  },
  notchWrapper: {
    position: 'absolute',
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 3,
  },
  notchWrapperAbove: {
    top: -12,
  },
  notchWrapperBelow: {
    bottom: -6,
    transform: [{ rotate: '180deg' }],
  },
  notchBorderMask: {
    height: 2,
    width: 54,
    backgroundColor: colors.pink,
    position: 'absolute',
    zIndex: 4,
    top: -1.5,
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
  tooltip: {
    width: '100%',
    backgroundColor: colors.pink,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 34,
    backfaceVisibility: 'hidden',
    transform: [{ perspective: 900 }, { rotateX: '-10deg' }],
    padding: DEFAULT_SPACE,
    gap: DEFAULT_SPACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
