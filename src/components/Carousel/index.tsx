import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useWindowDimensions } from 'react-native';

import { Text } from '@components/Text';

type Props = {
  items: ReactNode[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  autoPlay?: boolean;
};

const AUTO_PLAY_INTERVAL_MS = 3000;
const MAX_HEIGHT = 200;

/** Ignore glitched layouts (e.g. WebView before first content measure). */
const MIN_LAYOUT_HEIGHT = 12;

export const Carousel = ({
  items,
  initialIndex = 0,
  onIndexChange,
  autoPlay = false,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<ReactNode> | null>(null);

  const [carouselViewportWidth, setCarouselViewportWidth] = useState(0);
  const pageWidth =
    carouselViewportWidth > 0 ? carouselViewportWidth : windowWidth;

  const [index, setIndex] = useState(initialIndex);
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<number, number>
  >({});

  const [isVerticalScrolling, setIsVerticalScrolling] = useState(false);
  const onIndexChangeRef = useRef(onIndexChange);
  const indexRef = useRef(index);

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const [heightAnim] = useState(() => new Animated.Value(MAX_HEIGHT));

  const currentContentHeight = measuredHeights[index] ?? MAX_HEIGHT;
  const currentHeight = Math.min(currentContentHeight, MAX_HEIGHT);
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: currentHeight,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [currentHeight, heightAnim]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    if (pageWidth <= 0) return;
    if (isVerticalScrolling) return;

    const id = setInterval(() => {
      const prev = indexRef.current;
      const next = (prev + 1) % items.length;

      listRef.current?.scrollToOffset({
        offset: next * pageWidth,
        animated: true,
      });
      setIndex(next);
      onIndexChangeRef.current?.(next);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => clearInterval(id);
  }, [autoPlay, isVerticalScrolling, items.length, pageWidth]);

  const handleItemLayout = (i: number, e: LayoutChangeEvent) => {
    const h = Math.ceil(e.nativeEvent.layout.height);
    if (h < MIN_LAYOUT_HEIGHT) return;

    setMeasuredHeights(prev => (prev[i] === h ? prev : { ...prev, [i]: h }));
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    if (next !== index) {
      setIndex(next);
      onIndexChange?.(next);
    }
  };

  return (
    <Animated.View
      style={[styles.container, { height: heightAnim }]}
      onLayout={e => setCarouselViewportWidth(e.nativeEvent.layout.width)}
    >
      <FlatList
        horizontal
        pagingEnabled
        data={items}
        keyExtractor={(_, i) => String(i)}
        ref={listRef}
        scrollEnabled={!isVerticalScrolling} // 🔥 ключевой момент
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index: i }) => {
          const contentHeight = measuredHeights[i] ?? 0;
          const needScroll = contentHeight > MAX_HEIGHT;

          return (
            <View style={[styles.page, { width: pageWidth }]}>
              {needScroll ? (
                <ScrollView
                  directionalLockEnabled
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  style={styles.scrollViewFill}
                  onMomentumScrollEnd={() => setIsVerticalScrolling(false)}
                  onScrollEndDrag={() => setIsVerticalScrolling(false)}
                  onTouchEnd={() => setIsVerticalScrolling(false)}
                  onTouchStart={() => setIsVerticalScrolling(true)}
                >
                  <View onLayout={e => handleItemLayout(i, e)}>{item}</View>
                </ScrollView>
              ) : (
                <View
                  style={styles.itemCentered}
                  onLayout={e => handleItemLayout(i, e)}
                >
                  {item}
                </View>
              )}
            </View>
          );
        }}
        onMomentumScrollEnd={handleMomentumEnd}
      />

      {/* ← */}
      {index > 0 && (
        <Pressable
          style={[styles.arrow, styles.arrowLeft]}
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: (index - 1) * pageWidth,
              animated: true,
            })
          }
        >
          <View style={styles.arrowBubble}>
            <Text color="#fff">‹</Text>
          </View>
        </Pressable>
      )}

      {/* → */}
      {index < items.length - 1 && (
        <Pressable
          style={[styles.arrow, styles.arrowRight]}
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: (index + 1) * pageWidth,
              animated: true,
            })
          }
        >
          <View style={styles.arrowBubble}>
            <Text color="#fff">›</Text>
          </View>
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  page: {
    flexShrink: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollViewFill: {
    flex: 1,
  },
  itemCentered: {
    flex: 1,
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -18 }],
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  arrowBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'android' ? 4 : 0,
  },
});
