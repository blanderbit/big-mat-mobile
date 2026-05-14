import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  findNodeHandle,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { Button } from '@components/Button';
import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';
import { Trapezoid } from '@screens/Home/components/Trapezoid';
import { routes } from '@navigation/extra/routes';
import { HomeStackNavigationProp } from '@navigation/extra/types';

import { API } from '@API/index';
import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Topic } from '@extra/types';
import { useUserStore } from '@stores/userStore';

import background6 from '@assets/images/background6.png';
import background7 from '@assets/images/background7.png';
import background8 from '@assets/images/background8.png';
import background9 from '@assets/images/background9.png';
import Tooltip1Notch from '@assets/images/tooltip1Notch.svg';

const TOOLTIP_OFFSET = 20;
/** SVG notch width 56; slight overlap hides subpixel hairline at tooltip↔notch join. */
const TOOLTIP_NOTCH_SEAM_WIDTH = 58;
const TOOLTIP_NOTCH_SEAM_HEIGHT = 4;
/** Half of seam height — straddles the card edge and the notch. */
const TOOLTIP_NOTCH_SEAM_OVERLAP = TOOLTIP_NOTCH_SEAM_HEIGHT / 2;

type AnchorRect = { x: number; y: number; width: number; height: number };

const keyExtractor = (item: Topic) => String(item.id);

export const Home = () => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const { bottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<HomeStackNavigationProp>();
  const getTotalScore = useUserStore(s => s.getTotalScore);

  const { height: screenHeight } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const [tooltipTopicId, setTooltipTopicId] = useState<string | null>(null);
  const [tooltipAnchor, setTooltipAnchor] = useState<AnchorRect | null>(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [tooltipBelow, setTooltipBelow] = useState(false);
  const tooltipAnim = useRef(new Animated.Value(0)).current;
  const animatedFor = useRef<string | null>(null);
  const trapezoidRefs = useRef<Record<string, View | null>>({});

  const tooltipTopic =
    tooltipTopicId != null
      ? topics.find(item => item.id === tooltipTopicId)
      : undefined;

  const getTopics = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/v1/content/topics');
      await getTotalScore();
      setTopics(response.data.data.topics);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getTopics();
    })();
    // НЕ ДОБАВЛЯТЬ ЗАВИСИМОСТИ!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTotalScore();
    });
    return unsubscribe;
  }, [navigation, getTotalScore]);

  const ListHeader = () => (
    <>
      {isLoading ? (
        <View style={styles.refreshIndicatorWrap}>
          <ActivityIndicator />
        </View>
      ) : null}

      <Image
        resizeMode="contain"
        source={background6}
        style={styles.background6}
      />

      <Text bold size={30}>
        {t('whatWillWeLearnToday')}
      </Text>

      <Text marginTop={DEFAULT_SPACE * 2 + 30} size={14}>
        {t(
          'allSectionsHereWillHelpYouMasterMathematicalGaps.OurTeamWorksDayAndNightSoThatTheyBecomeAvailableAsEarlyAsPossible',
        )}
      </Text>

      <Image
        resizeMode="contain"
        source={background7}
        style={styles.background7}
      />

      <View
        style={[
          styles.topicsListTopSpacer,
          topics.length > 0
            ? styles.topicsListTopSpacerWithTopics
            : styles.topicsListTopSpacerEmpty,
        ]}
      />
    </>
  );

  const ListFooter = () => (
    <>
      <View
        style={[
          styles.promoContainer,
          { marginTop: DEFAULT_SPACE * 2, marginBottom: bottom + 100 },
        ]}
      >
        <Image
          resizeMode="contain"
          source={background8}
          style={styles.promoBackground8}
        />

        <View style={styles.promoTitleContainer}>
          <Text center semiBold color={colors.white} size={32}>
            {t('whenMathDoesNotScare.ButInsteadItIsFunAndInteresting')}
          </Text>
        </View>

        <View style={styles.promoBottom}>
          <Image
            resizeMode="contain"
            source={background9}
            style={styles.promoBackground9}
          />

          <View style={styles.promoInspire}>
            <Text color={colors.brightBeige} size={32}>
              {t('inspire')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const measureAnchor = (id: string) => {
    const ref = trapezoidRefs.current[id];
    if (!ref) return;
    const handle = findNodeHandle(ref);
    if (!handle) return;
    UIManager.measureInWindow(handle, (x, y, width, height) => {
      setTooltipAnchor({ x, y, width, height });
    });
  };

  const handleCloseTooltip = () => {
    tooltipAnim.setValue(0);
    animatedFor.current = null;
    setTooltipTopicId(null);
  };

  useEffect(() => {
    if (tooltipTopicId == null) {
      setTooltipHeight(0);
      setTooltipAnchor(null);
      tooltipAnim.setValue(0);
      animatedFor.current = null;
      return;
    }
    if (!tooltipAnchor || tooltipHeight === 0) return;

    const needed = tooltipHeight + TOOLTIP_OFFSET;
    const spaceAbove = tooltipAnchor.y - headerHeight;
    const spaceBelow =
      screenHeight - (tooltipAnchor.y + tooltipAnchor.height) - bottom;

    let shouldBeBelow: boolean;
    if (spaceAbove >= needed) {
      shouldBeBelow = false;
    } else if (spaceBelow >= needed) {
      shouldBeBelow = true;
    } else {
      shouldBeBelow = spaceBelow > spaceAbove;
    }
    setTooltipBelow(prev => (prev === shouldBeBelow ? prev : shouldBeBelow));

    if (animatedFor.current !== tooltipTopicId) {
      animatedFor.current = tooltipTopicId;
      tooltipAnim.setValue(0);
      Animated.spring(tooltipAnim, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [
    tooltipTopicId,
    tooltipAnchor,
    tooltipHeight,
    headerHeight,
    screenHeight,
    bottom,
    tooltipAnim,
  ]);

  const handleScroll = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (tooltipTopicId == null) return;
    measureAnchor(tooltipTopicId);
  };

  const handlePressTopic = (item: Topic) => {
    if (!item.locked) {
      navigation.navigate(routes.home.TOPIC, { topicId: item.id });
      return;
    }
    if (tooltipTopicId === item.id) {
      handleCloseTooltip();
      return;
    }
    tooltipAnim.setValue(0);
    animatedFor.current = null;
    setTooltipHeight(0);
    setTooltipAnchor(null);
    setTooltipTopicId(item.id);
    measureAnchor(item.id);
  };

  const handlePressStartFromTooltip = () => {
    if (tooltipTopic == null) return;
    const { id } = tooltipTopic;
    handleCloseTooltip();
    navigation.navigate(routes.home.TOPIC, { topicId: id });
  };

  const renderItem = ({ item, index }: { item: Topic; index: number }) => {
    return (
      <View
        collapsable={false}
        ref={ref => {
          trapezoidRefs.current[item.id] = ref;
        }}
      >
        <Pressable onPress={() => handlePressTopic(item)}>
          <Trapezoid {...item} isLast={index === topics.length - 1} />
        </Pressable>
      </View>
    );
  };

  const tooltipTop =
    tooltipAnchor == null
      ? 0
      : tooltipBelow
      ? tooltipAnchor.y + tooltipAnchor.height + TOOLTIP_OFFSET
      : tooltipAnchor.y - TOOLTIP_OFFSET - tooltipHeight;

  return (
    <View style={styles.root}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={topics}
        keyExtractor={keyExtractor}
        ListFooterComponent={ListFooter}
        ListHeaderComponent={ListHeader}
        renderItem={renderItem}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            // Hide native spinner; we render our own ActivityIndicator above.
            colors={['transparent']}
            refreshing={isLoading}
            tintColor="transparent"
            onRefresh={getTopics}
          />
        }
        onScroll={handleScroll}
      />

      {tooltipTopic && tooltipAnchor && (
        <>
          <Pressable
            style={styles.tooltipBackdrop}
            onPress={handleCloseTooltip}
          />

          <View
            pointerEvents="box-none"
            style={[
              styles.tooltipOverlay,
              {
                top: tooltipTop,
                left: tooltipAnchor.x,
                width: tooltipAnchor.width,
                opacity: tooltipHeight === 0 ? 0 : 1,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.tooltipAnimWrap,
                {
                  opacity: tooltipAnim,
                  transform: [
                    {
                      translateY: tooltipAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [tooltipBelow ? -8 : 8, 0],
                      }),
                    },
                    {
                      scale: tooltipAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={styles.tooltip}
                onLayout={e => setTooltipHeight(e.nativeEvent.layout.height)}
              >
                <Text bold size={20}>
                  {tooltipTopic.title}
                </Text>

                <Text center size={18}>
                  {t('lockedTopicSequenceWarning')}
                </Text>

                <Button title={t('close')} onPress={handleCloseTooltip} />

                <Button
                  title={t('start')}
                  onPress={handlePressStartFromTooltip}
                />
              </View>

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.tooltipNotchSeam,
                  tooltipBelow
                    ? styles.tooltipNotchSeamNotchAbove
                    : styles.tooltipNotchSeamNotchBelow,
                  { opacity: tooltipAnim },
                ]}
              >
                <View
                  style={[
                    styles.tooltipNotchSeamBar,
                    { width: TOOLTIP_NOTCH_SEAM_WIDTH },
                  ]}
                />
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.notchWrapper,
                  tooltipBelow
                    ? styles.notchWrapperBelow
                    : styles.notchWrapperAbove,
                  { opacity: tooltipAnim },
                ]}
              >
                <Tooltip1Notch />
              </Animated.View>
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  refreshIndicatorWrap: {
    alignItems: 'center',
    paddingVertical: DEFAULT_SPACE,
  },
  listContent: {
    paddingHorizontal: DEFAULT_SPACE,
    paddingVertical: DEFAULT_SPACE,
  },
  background6: {
    width: 150,
    position: 'absolute',
    top: -150,
    right: -DEFAULT_SPACE,
  },
  background7: {
    width: '100%',
    position: 'absolute',
    top: -200,
    left: 0,
    zIndex: -1,
  },
  topicsListTopSpacer: {
    marginTop: 0,
  },
  topicsListTopSpacerWithTopics: {
    marginTop: DEFAULT_SPACE * 3,
  },
  topicsListTopSpacerEmpty: {
    marginTop: DEFAULT_SPACE * 2,
  },
  promoContainer: {
    backgroundColor: colors.brightPurple,
    borderRadius: 70,
    marginHorizontal: -DEFAULT_SPACE,
    paddingTop: DEFAULT_SPACE * 2,
    paddingBottom: DEFAULT_SPACE,
    marginTop: DEFAULT_SPACE * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBackground8: {
    width: 200,
    position: 'absolute',
    top: 0,
    right: -DEFAULT_SPACE,
    zIndex: 4,
  },
  promoTitleContainer: {
    zIndex: 3,
  },
  promoBottom: {
    marginTop: -60,
    zIndex: 2,
  },
  promoBackground9: {
    width: 250,
  },
  promoInspire: {
    position: 'absolute',
    top: 60,
    right: 30,
    transform: [{ rotate: '-2deg' }],
  },
  tooltipBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 5,
  },
  tooltipOverlay: {
    position: 'absolute',
    zIndex: 6,
  },
  tooltipAnimWrap: {
    width: '100%',
  },
  tooltip: {
    width: '100%',
    backgroundColor: colors.pink,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 34,
    backfaceVisibility: 'hidden',
    padding: DEFAULT_SPACE,
    gap: DEFAULT_SPACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notchWrapper: {
    position: 'absolute',
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
  notchWrapperAbove: {
    bottom: -31.5,
  },
  notchWrapperBelow: {
    top: -31.5,
    transform: [{ rotate: '180deg' }],
  },
  tooltipNotchSeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    height: TOOLTIP_NOTCH_SEAM_HEIGHT,
  },
  /** Tooltip below anchor: notch sits on top of the card — cover join at top edge. */
  tooltipNotchSeamNotchAbove: {
    top: -TOOLTIP_NOTCH_SEAM_OVERLAP,
  },
  /** Tooltip above anchor: notch hangs under the card — cover join at bottom edge. */
  tooltipNotchSeamNotchBelow: {
    bottom: -TOOLTIP_NOTCH_SEAM_OVERLAP,
  },
  tooltipNotchSeamBar: {
    height: TOOLTIP_NOTCH_SEAM_HEIGHT,
    backgroundColor: colors.pink,
  },
});
