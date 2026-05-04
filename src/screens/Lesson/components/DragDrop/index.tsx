import { useRef, useState } from 'react';
import {
  findNodeHandle,
  GestureResponderEvent,
  LayoutRectangle,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Icon } from '@components/Icon';
import { SlideQuestion } from '@components/Question';
import { Text } from '@components/Text';
import { Wrapper } from '@screens/Lesson/components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { DragDropItem, DragDropItemType, Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.DRAG_DROP>;
  lessonId: string;
  setScrollEnabled?: (enabled: boolean) => void;
};

export const DragDrop = ({ setScrollEnabled, slide, lessonId }: Props) => {
  const variant = slide.variants[0];
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const containerRef = useRef<View>(null);
  const zoneRefs = useRef<Record<string, View | null>>({});
  const { t } = useTranslation();
  const [containerWindow, setContainerWindow] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [bankWidth, setBankWidth] = useState(0);
  const [zonesLayout, setZonesLayout] = useState<
    Record<string, LayoutRectangle>
  >({});
  const [itemZone, setItemZone] = useState<Record<string, string | null>>(
    () => {
      const initial: Record<string, string | null> = {};

      variant.items.forEach(it => {
        initial[it.id] = null;
      });

      return initial;
    },
  );
  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const [hoverZoneId, setHoverZoneId] = useState<string | null>(null);
  const hasUnplacedItems = variant.items.some(it => itemZone[it.id] == null);
  const dragDisabled = isCorrect != null;

  const updateContainerWindow = () => {
    const node = containerRef.current;
    if (!node) return;

    const handle = findNodeHandle(node);
    if (!handle) return;

    UIManager.measureInWindow(handle, (x: number, y: number) => {
      setContainerWindow({ x, y });
    });
  };

  const measureZone = (zoneId: string) => {
    const node = zoneRefs.current[zoneId];
    if (!node) return;

    const handle = findNodeHandle(node);
    if (!handle) return;

    UIManager.measureInWindow(
      handle,
      (pageX: number, pageY: number, width: number, height: number) => {
        setZonesLayout(prev => ({
          ...prev,
          [zoneId]: {
            x: pageX,
            y: pageY,
            width,
            height,
          },
        }));
      },
    );
  };

  const getZoneHitId = (pageX: number, pageY: number) => {
    const hit = Object.entries(zonesLayout).find(([, r]) => {
      return (
        pageX >= r.x &&
        pageX <= r.x + r.width &&
        pageY >= r.y &&
        pageY <= r.y + r.height
      );
    });

    return hit ? hit[0] : null;
  };

  const dropToZone = (itemId: string, pageX: number, pageY: number) => {
    const nextZoneId = hoverZoneId ?? getZoneHitId(pageX, pageY);

    setItemZone(prev => ({ ...prev, [itemId]: nextZoneId }));
  };

  const handleDragStart = (itemId: string, e: GestureResponderEvent) => {
    if (dragDisabled) return;
    setScrollEnabled?.(false);
    setDraggingItemId(itemId);
    setHoverZoneId(null);
    variant.zones.forEach(z => measureZone(z.id));
    setDragPos({
      left: e.nativeEvent.pageX - containerWindow.x - ITEM_SIZE / 2,
      top: e.nativeEvent.pageY - containerWindow.y - ITEM_SIZE / 2,
    });
  };

  const handleDragMove = (e: GestureResponderEvent) => {
    if (dragDisabled) return;
    const nextPos = {
      left: e.nativeEvent.pageX - containerWindow.x - ITEM_SIZE / 2,
      top: e.nativeEvent.pageY - containerWindow.y - ITEM_SIZE / 2,
    };

    setDragPos(nextPos);

    setHoverZoneId(getZoneHitId(e.nativeEvent.pageX, e.nativeEvent.pageY));
  };

  const handleDragRelease = (itemId: string, e: GestureResponderEvent) => {
    if (dragDisabled) return;
    dropToZone(itemId, e.nativeEvent.pageX, e.nativeEvent.pageY);
    setDraggingItemId(null);
    setHoverZoneId(null);
    setScrollEnabled?.(true);
  };

  const handleDragTerminate = () => {
    setDraggingItemId(null);
    setHoverZoneId(null);
    setScrollEnabled?.(true);
  };

  const renderItemContent = (item: DragDropItem) => {
    if (item.type === DragDropItemType.TEXT) {
      return (
        <Text center semiBold size={14}>
          {item.text}
        </Text>
      );
    }

    if (item.type === DragDropItemType.NUMBER) {
      return (
        <Text center semiBold size={14}>
          {String(item.value)}
        </Text>
      );
    }

    if (item.type === DragDropItemType.IMAGE) {
      return (
        <View style={styles.imageWrap}>
          <FullWidthFastImage style={styles.image} uri={item.imageUrl} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.blockWrap,
          { backgroundColor: item.color ?? colors.brightPurple },
        ]}
      >
        {item.icon ? (
          <Icon color={colors.white} icon={item.icon} size={22} />
        ) : null}
        <Text center semiBold color={colors.white} size={12}>
          {item.label}
        </Text>
      </View>
    );
  };

  const answer = async () => {
    const expected = variant.itemZoneMap;
    const mismatches: Array<{
      itemId: string;
      expectedZoneId: null | string;
      actualZoneId: null | string;
    }> = [];

    variant.items.forEach(it => {
      const expectedZoneIdRaw = expected[it.id];
      const expectedZoneId =
        expectedZoneIdRaw && expectedZoneIdRaw !== '0'
          ? expectedZoneIdRaw
          : null;

      const actualZoneId = itemZone[it.id] ?? null;

      if (expectedZoneId !== actualZoneId) {
        mismatches.push({ itemId: it.id, expectedZoneId, actualZoneId });
      }
    });

    const isCorrect = mismatches.length === 0;
    setIsCorrect(isCorrect);
  };

  return (
    <Wrapper>
      <SlideQuestion content={slide.variants[0].questionText} />
      <View
        ref={containerRef}
        style={styles.container}
        onLayout={() => {
          updateContainerWindow();
          // re-measure zones after layout
          variant.zones.forEach(z => measureZone(z.id));
        }}
      >
        <View
          style={[
            styles.bankSection,
            hasUnplacedItems ? styles.bankSectionWithBottomPadding : null,
          ]}
        >
          <View
            style={styles.bank}
            onLayout={e => setBankWidth(e.nativeEvent.layout.width)}
          >
            {(() => {
              const bankItems = variant.items.filter(
                it => itemZone[it.id] == null,
              );
              const columns = bankWidth
                ? Math.max(
                    1,
                    Math.floor(
                      (bankWidth + DEFAULT_SPACE) / (ITEM_SIZE + DEFAULT_SPACE),
                    ),
                  )
                : 3;
              const remainder = bankItems.length % columns;
              const spacerCount = remainder === 0 ? 0 : columns - remainder;

              return (
                <>
                  {bankItems.map(it => {
                    const isDragging = draggingItemId === it.id;

                    return (
                      <View
                        key={it.id}
                        style={[
                          styles.item,
                          isDragging ? styles.itemHidden : null,
                        ]}
                        onResponderGrant={e => handleDragStart(it.id, e)}
                        onResponderMove={handleDragMove}
                        onResponderRelease={e => handleDragRelease(it.id, e)}
                        onResponderTerminate={handleDragTerminate}
                        onStartShouldSetResponder={() => !dragDisabled}
                      >
                        {renderItemContent(it)}
                      </View>
                    );
                  })}

                  {Array.from({ length: spacerCount }).map((_, i) => (
                    <View
                      key={`bank-spacer-${i}`}
                      pointerEvents="none"
                      style={styles.itemSpacer}
                    />
                  ))}
                </>
              );
            })()}
          </View>
        </View>

        <View style={styles.zonesSection}>
          <View style={styles.zones}>
            {variant.zones.map(z => {
              const zoneItems = variant.items.filter(
                i => itemZone[i.id] === z.id,
              );
              const zoneWidth = zonesLayout[z.id]?.width;
              const columns = zoneWidth
                ? Math.max(
                    1,
                    Math.floor(
                      (zoneWidth + DEFAULT_SPACE) / (ITEM_SIZE + DEFAULT_SPACE),
                    ),
                  )
                : 3;
              const remainder = zoneItems.length % columns;
              const spacerCount = remainder === 0 ? 0 : columns - remainder;

              return (
                <View
                  key={z.id}
                  ref={r => {
                    zoneRefs.current[z.id] = r;
                  }}
                  style={[
                    styles.zone,
                    hoverZoneId === z.id ? styles.zoneHover : null,
                  ]}
                  onLayout={() => measureZone(z.id)}
                >
                  <Text bold size={14}>
                    {z.label}
                  </Text>

                  <View style={styles.zoneInner}>
                    {zoneItems.length === 0 ? (
                      <Text color={colors.darkGrey} size={14}>
                        ...
                      </Text>
                    ) : (
                      <View style={styles.zoneItems}>
                        {zoneItems.map(it => {
                          const isDragging = draggingItemId === it.id;

                          return (
                            <View
                              key={it.id}
                              style={[
                                styles.itemInZone,
                                isDragging ? styles.itemHidden : null,
                              ]}
                              onResponderGrant={e => handleDragStart(it.id, e)}
                              onResponderMove={handleDragMove}
                              onResponderTerminate={handleDragTerminate}
                              onStartShouldSetResponder={() => !dragDisabled}
                              onResponderRelease={e =>
                                handleDragRelease(it.id, e)
                              }
                            >
                              {renderItemContent(it)}
                            </View>
                          );
                        })}

                        {Array.from({ length: spacerCount }).map((_, i) => (
                          <View
                            key={`${z.id}-spacer-${i}`}
                            pointerEvents="none"
                            style={styles.itemSpacer}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {draggingItemId
          ? (() => {
              const draggingItem = variant.items.find(
                i => i.id === draggingItemId,
              );
              if (!draggingItem) return null;

              return (
                <View
                  pointerEvents="none"
                  style={[styles.dragOverlay, dragPos]}
                >
                  {renderItemContent(draggingItem)}
                </View>
              );
            })()
          : null}
      </View>

      <Button
        disabled={hasUnplacedItems || isCorrect != null || isLoading}
        title={t('check')}
        onPress={answer}
      />

      {isCorrect != null && (
        <AnswerResult
          disabled={isLoading}
          isCorrect={isCorrect}
          isLoading={isLoading}
          text={
            isCorrect
              ? slide.variants[0].explanation?.content[0]?.content[0]?.text
              : slide.variants[0].wrongExplanation?.content[0]?.content[0]?.text
          }
          onPressNext={handleGoToNextSlide}
        />
      )}
    </Wrapper>
  );
};

const ITEM_SIZE = 96;

const styles = StyleSheet.create({
  bank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
  },
  bankSection: {
    gap: DEFAULT_SPACE,
  },
  bankSectionWithBottomPadding: {
    paddingBottom: DEFAULT_SPACE,
  },
  blockWrap: {
    width: '100%',
    borderRadius: 12,
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.brightPurple,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  dragOverlay: {
    position: 'absolute',
    width: ITEM_SIZE,
    minHeight: ITEM_SIZE,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrap: {
    width: '100%',
    minHeight: ITEM_SIZE - 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxHeight: '100%',
  },
  item: {
    width: ITEM_SIZE,
    minHeight: ITEM_SIZE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemHidden: {
    opacity: 0,
  },
  itemInZone: {
    width: ITEM_SIZE,
    minHeight: ITEM_SIZE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSpacer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    opacity: 0,
  },
  zone: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.brightBeige,
    padding: DEFAULT_SPACE,
    gap: 8,
  },
  zoneHover: {
    borderWidth: 2,
    backgroundColor: colors.blightBlue,
  },
  zoneInner: {
    minHeight: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneItems: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
  },
  zones: {
    gap: DEFAULT_SPACE,
  },
  zonesSection: {
    gap: DEFAULT_SPACE,
  },
});
