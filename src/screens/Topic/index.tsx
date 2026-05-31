import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
import { RoundSlider } from '@components/RoundSlider';
import { ScrollView } from '@components/ScrollView';
import { Text } from '@components/Text';
import { routes } from '@navigation/extra/routes';
import {
  HomeStackNavigationProp,
  HomeStackParamList,
} from '@navigation/extra/types';

import { API } from '@API/index';
import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { pluralizeUk } from '@extra/pluralizeUk';
import { Lesson } from '@extra/types';
import { useUserStore } from '@stores/userStore';

import ActiveLessonButton from '@assets/images/activeLessonButton.svg';
import Background10 from '@assets/images/background10.svg';
import InactiveLessonButton from '@assets/images/inactiveLessonButton.svg';
import lock2 from '@assets/images/lock2.png';
import Tooltip1Notch from '@assets/images/tooltip1Notch.svg';

type Props = {
  route: RouteProp<HomeStackParamList, typeof routes.home.TOPIC>;
};

type TopicProgress = {
  completedRoutes: number;
  inProgressRoutes: number;
  notStartedRoutes: number;
  totalRoutes: number;
};

export const Topic = ({ route }: Props) => {
  const { t } = useTranslation();
  const { topicId } = route.params;
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<HomeStackNavigationProp>();
  const { navigate } = navigation;
  const getTotalScore = useUserStore(s => s.getTotalScore);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lessonButtonWidth, setLessonButtonWidth] = useState(0);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState(0);
  const [firstLockedTooltipBelow, setFirstLockedTooltipBelow] = useState(false);
  const firstLockedButtonWrapperRef = useRef<View | null>(null);
  const setFirstLockedButtonWrapperNode = useCallback((node: View | null) => {
    firstLockedButtonWrapperRef.current = node;
  }, []);
  const [tooltipIndex, setTooltipIndex] = useState(-1);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipAnim = useMemo(() => new Animated.Value(0), []);
  const hasLoadedOnce = useRef(false);

  const refreshTopicData = useCallback(
    async (showLoader: boolean) => {
      if (showLoader) {
        setIsLoading(true);
      }

      try {
        const [lessonsResponse, topicProgressResponse] = await Promise.all([
          API.get(`/v1/content/topics/${topicId}/routes`),
          API.get(`/v1/content/topics/${topicId}/progress`),
          getTotalScore(),
        ]);

        setLessons(lessonsResponse.data.data.routes);
        setTopicProgress(topicProgressResponse.data.data.summary);
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [getTotalScore, topicId],
  );

  useEffect(() => {
    const shouldShowLoader = !hasLoadedOnce.current;

    refreshTopicData(shouldShowLoader).finally(() => {
      hasLoadedOnce.current = true;
    });

    const unsubscribe = navigation.addListener('focus', () => {
      refreshTopicData(false);
    });
    return unsubscribe;
  }, [navigation, refreshTopicData]);

  const handleSetContainerWidth = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const contentWidth = containerWidth || screenWidth;
  const TOOLTIP_OFFSET_FROM_BUTTON = 105;

  const updateFirstLockedTooltipSide = () => {
    const node =
      firstLockedButtonWrapperRef.current != null
        ? findNodeHandle(firstLockedButtonWrapperRef.current)
        : null;

    if (!node || tooltipHeight === 0) return;

    UIManager.measureInWindow(node, (_x, buttonY, _w, buttonHeight) => {
      const needed = tooltipHeight + TOOLTIP_OFFSET_FROM_BUTTON;
      const spaceAbove = buttonY - headerHeight;
      const spaceBelow = screenHeight - (buttonY + buttonHeight) - bottom;

      let shouldBeBelow: boolean;
      if (spaceAbove >= needed) {
        shouldBeBelow = false;
      } else if (spaceBelow >= needed) {
        shouldBeBelow = true;
      } else {
        shouldBeBelow = spaceBelow > spaceAbove;
      }

      setFirstLockedTooltipBelow(prev =>
        prev === shouldBeBelow ? prev : shouldBeBelow,
      );
    });
  };

  useEffect(() => {
    if (tooltipIndex === -1) {
      setTooltipHeight(0);
      tooltipAnim.setValue(0);
      return;
    }
    updateFirstLockedTooltipSide();

    if (tooltipHeight > 0) {
      tooltipAnim.setValue(0);
      Animated.spring(tooltipAnim, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltipIndex, tooltipHeight, headerHeight, screenHeight, bottom]);

  const handleCloseTooltip = () => {
    tooltipAnim.setValue(0);
    setTooltipIndex(-1);
  };

  const handleScroll = () => {
    if (tooltipIndex === -1) return;
    updateFirstLockedTooltipSide();
  };

  const completedRoutes = topicProgress?.completedRoutes ?? 0;
  const totalRoutes =
    topicProgress?.totalRoutes ??
    (lessons.length > 0 ? lessons.length : 0);
  const progressPercent =
    totalRoutes > 0 ? (completedRoutes / totalRoutes) * 100 : 0;

  const topicTitleKey =
    completedRoutes === 0
      ? 'topicTitle.empty'
      : progressPercent >= 100
      ? 'topicTitle.done'
      : progressPercent <= 20
      ? 'topicTitle.started'
      : progressPercent <= 60
      ? 'topicTitle.middle'
      : 'topicTitle.almost';
  const tooltipTranslateY = tooltipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [firstLockedTooltipBelow ? -8 : 8, 0],
  });
  const tooltipScale = tooltipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      scrollEventThrottle={32}
      scrollViewStyle={styles.scrollView}
      onLayout={handleSetContainerWidth}
      onScroll={handleScroll}
    >
      {isLoading ? (
        <View style={styles.loadingIndicatorWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          {tooltipIndex !== -1 && (
            <Pressable
              style={styles.tooltipBackdrop}
              onPress={handleCloseTooltip}
            />
          )}

          <Text bold center color={colors.white} size={24}>
            {t('youAreDoingGreat')}
          </Text>

          <View style={styles.lessonsContainer}>
            {lessons.map((lesson, index) => {
              const isLeft = (index + 1) % 2 === 1;
              const isLast = index === lessons.length - 1;
              const isShowTooltip = index === tooltipIndex;

              const navigateToStartLesson = () => {
                handleCloseTooltip();
                navigate(routes.home.START_LESSON, {
                  lesson,
                  lessonIndex: index + 1,
                });
              };

              const handleToggleTooltip = () => {
                tooltipAnim.setValue(0);
                setTooltipHeight(0);
                setTooltipIndex(prev => (prev === index ? -1 : index));
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
                        tooltipHeight === 0 ? styles.tooltipMeasuring : null,
                      ]}
                    >
                      <Animated.View
                        style={[
                          styles.tooltipAnimationWrap,
                          {
                            opacity: tooltipAnim,
                            transform: [
                              { translateY: tooltipTranslateY },
                              { scale: tooltipScale },
                            ],
                          },
                        ]}
                      >
                        <View
                          style={styles.tooltip}
                          onLayout={e =>
                            setTooltipHeight(e.nativeEvent.layout.height)
                          }
                        >
                          <Text bold size={20}>
                            {index + 1}. {lesson.title}
                          </Text>

                          {lesson.locked && (
                            <Text center size={18}>
                              {t('lockedSequenceWarning')}
                            </Text>
                          )}

                          {lesson.subtitle && (
                            <Text center semiBold size={14}>
                              {lesson.subtitle}
                            </Text>
                          )}

                          <View
                            style={[
                              styles.tooltipButtons,
                              !lesson.locked
                                ? styles.tooltipButtonsReverse
                                : null,
                              styles.tooltipButtonsFullWidth,
                            ]}
                          >
                            <Button
                              title={t('close')}
                              onPress={handleCloseTooltip}
                            />

                            <Button
                              title={t('start')}
                              onPress={navigateToStartLesson}
                            />
                          </View>
                        </View>
                      </Animated.View>

                      {isShowTooltip ? (
                        <Animated.View
                          pointerEvents="none"
                          style={[
                            styles.lessonNotch,
                            firstLockedTooltipBelow
                              ? styles.lessonNotchBelow
                              : styles.lessonNotchAbove,
                            isLeft
                              ? styles.lessonNotchLeft
                              : styles.lessonNotchRight,
                            { width: lessonButtonWidth, opacity: tooltipAnim },
                            firstLockedTooltipBelow
                              ? styles.lessonNotchRotated
                              : null,
                          ]}
                        >
                          <Tooltip1Notch />
                        </Animated.View>
                      ) : null}
                    </View>
                  )}

                  <View
                    ref={
                      isShowTooltip
                        ? setFirstLockedButtonWrapperNode
                        : undefined
                    }
                    style={[
                      styles.lessonButtonWrapper,
                      isLeft
                        ? styles.lessonButtonLeft
                        : styles.lessonButtonRight,
                      isShowTooltip ? styles.lessonButtonWrapperOnTop : null,
                    ]}
                    onLayout={e =>
                      setLessonButtonWidth(e.nativeEvent.layout.width)
                    }
                  >
                    <Pressable onPress={handleToggleTooltip}>
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
            {t(topicTitleKey)}
          </Text>

          <RoundSlider
            marginBottom={bottom}
            marginHorizontal={DEFAULT_SPACE}
            marginTop={DEFAULT_SPACE}
            value={progressPercent}
            tooltipText={
              completedRoutes +
              ' ' +
              pluralizeUk(completedRoutes, [
                t('level_one'),
                t('level_few'),
                t('level_many'),
              ]) +
              ' ' +
              t('from') +
              ' ' +
              totalRoutes
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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingIndicatorWrap: {
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  tooltipBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
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
    zIndex: 20,
    elevation: 20,
  },
  firstLockedTooltipAbove: {
    bottom: 105,
  },
  firstLockedTooltipBelow: {
    top: 90,
  },
  tooltipMeasuring: {
    opacity: 0,
  },
  tooltipAnimationWrap: {
    width: '100%',
  },
  tooltipButtons: {
    gap: 12,
  },
  tooltipButtonsFullWidth: {
    width: '100%',
  },
  tooltipButtonsReverse: {
    flexDirection: 'column-reverse',
  },
  lessonNotch: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 30,
  },
  lessonNotchAbove: {
    bottom: -23,
  },
  lessonNotchBelow: {
    top: -30.5,
  },
  lessonNotchLeft: {
    left: '10%',
  },
  lessonNotchRight: {
    right: '10%',
  },
  lessonNotchRotated: {
    transform: [{ rotate: '180deg' }],
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
    zIndex: 1,
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
