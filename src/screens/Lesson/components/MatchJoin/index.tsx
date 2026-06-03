import { useState } from 'react';
import { Alert, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.MATCH_JOIN>;
  lessonId: string;
};

type ItemLayout = { x: number; y: number; width: number; height: number };

const hashStringToU32 = (s: string) => {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleDeterministic = <T,>(
  items: T[],
  seedString: string,
  enabled: boolean,
) => {
  if (!enabled) return items;
  const out = [...items];
  const rand = mulberry32(hashStringToU32(seedString));
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const MatchJoin = ({ slide, lessonId }: Props) => {
  const variant = slide.variants[0];
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { t } = useTranslation();
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedLeftIdByRightId, setMatchedLeftIdByRightId] = useState<
    Record<string, string>
  >({});
  const [leftLayoutById, setLeftLayoutById] = useState<
    Record<string, ItemLayout>
  >({});
  const [rightLayoutById, setRightLayoutById] = useState<
    Record<string, ItemLayout>
  >({});
  const [leftColOffset, setLeftColOffset] = useState({ x: 0, y: 0 });
  const [rightColOffset, setRightColOffset] = useState({ x: 0, y: 0 });
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const { handleGoToNextSlide, setAnswerResult } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const leftItems = shuffleDeterministic(
    variant.leftItems,
    `${slide.id}:left`,
    variant.shuffleLeft,
  );
  const rightItems = shuffleDeterministic(
    variant.rightItems,
    `${slide.id}:right`,
    variant.shuffleRight,
  );

  const allMatched = rightItems.every(r => matchedLeftIdByRightId[r.id] != null);

  const isRightConnected = (rightId: string) =>
    matchedLeftIdByRightId[rightId] != null;

  const isLeftConnected = (leftId: string) =>
    Object.values(matchedLeftIdByRightId).some(v => v === leftId);

  const answer = () => {
    if (!rightItems.length) return;
    if (!allMatched) return;

    const allCorrect = rightItems.every(
      r => matchedLeftIdByRightId[r.id] === r.matchesLeftId,
    );
    setAnswerResult(allCorrect);
  };

  const getRightIdByLeftId = (leftId: string) => {
    for (const [rightId, matchedLeftId] of Object.entries(
      matchedLeftIdByRightId,
    )) {
      if (matchedLeftId === leftId) return rightId;
    }
    return null;
  };

  const setConnection = (rightId: string, leftId: string) => {
    setMatchedLeftIdByRightId(prev => {
      const next = { ...prev };

      // Enforce uniqueness: one right -> one left; one left -> one right.
      const existingRightForLeft = Object.entries(next).find(
        ([, l]) => l === leftId,
      )?.[0];
      if (existingRightForLeft && existingRightForLeft !== rightId) {
        next[existingRightForLeft] = undefined as never;
      }

      next[rightId] = leftId;
      return next;
    });
  };

  const removeConnectionByRightId = (rightId: string) => {
    setMatchedLeftIdByRightId(prev => {
      if (prev[rightId] == null) return prev;
      const next = { ...prev };
      next[rightId] = undefined as never;
      return next;
    });
  };

  const confirmReplaceOrRemove = (message: string, onConfirm: () => void) => {
    Alert.alert(t('attention'), message, [
      { text: t('cancel'), style: 'cancel' },
      { text: t('ok'), onPress: onConfirm },
    ]);
  };

  const onPressLeft = (leftId: string) => {
    if (isCorrect != null) return;

    // If left is already connected and user taps it (without having a right selected),
    // treat it as "remove connection" with confirmation.
    if (!selectedRightId) {
      const rightId = getRightIdByLeftId(leftId);
      if (rightId) {
        confirmReplaceOrRemove(t('remove_connection_question'), () => {
          removeConnectionByRightId(rightId);
        });
        return;
      }
    }

    if (selectedRightId) {
      const rightAlreadyMatched = matchedLeftIdByRightId[selectedRightId];
      const rightOfThisLeft = getRightIdByLeftId(leftId);
      const wouldChange =
        rightAlreadyMatched != null || (rightOfThisLeft && rightOfThisLeft !== selectedRightId);

      const doConnect = () => setConnection(selectedRightId, leftId);

      if (wouldChange) {
        confirmReplaceOrRemove(t('replace_connection_question'), doConnect);
      } else {
        doConnect();
      }
      setSelectedRightId(null);
      setSelectedLeftId(null);
      return;
    }
    setSelectedLeftId(prev => (prev === leftId ? null : leftId));
  };

  const onPressRight = (rightId: string) => {
    if (isCorrect != null) return;

    // If right is already connected and user taps it (without having a left selected),
    // treat it as "remove connection" with confirmation.
    if (!selectedLeftId && matchedLeftIdByRightId[rightId]) {
      confirmReplaceOrRemove(t('remove_connection_question'), () => {
        removeConnectionByRightId(rightId);
      });
      return;
    }

    if (selectedLeftId) {
      const rightAlreadyMatched = matchedLeftIdByRightId[rightId];
      const rightOfThisLeft = getRightIdByLeftId(selectedLeftId);
      const wouldChange =
        rightAlreadyMatched != null || (rightOfThisLeft && rightOfThisLeft !== rightId);

      const doConnect = () => setConnection(rightId, selectedLeftId);

      if (wouldChange) {
        confirmReplaceOrRemove(t('replace_connection_question'), doConnect);
      } else {
        doConnect();
      }
      setSelectedLeftId(null);
      setSelectedRightId(null);
      return;
    }
    setSelectedRightId(prev => (prev === rightId ? null : rightId));
  };

  const connections = rightItems
    .map(r => {
      const leftId = matchedLeftIdByRightId[r.id];
      if (!leftId) return null;
      const l = leftLayoutById[leftId];
      const rr = rightLayoutById[r.id];
      if (!l || !rr) return null;

      const startX = leftColOffset.x + l.x + l.width;
      const startY = leftColOffset.y + l.y + l.height / 2;
      const endX = rightColOffset.x + rr.x;
      const endY = rightColOffset.y + rr.y + rr.height / 2;

      const dx = Math.max(20, endX - startX);
      const c1x = startX + dx * 0.5;
      const c2x = endX - dx * 0.5;

      const d = `M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`;
      return { id: r.id, d };
    })
    .filter((x): x is { id: string; d: string } => x != null);

  return (
    <Wrapper>
      {variant.introBlocks && <Blocks blocks={variant.introBlocks} />}

      <View
        style={styles.row}
        onLayout={(e: LayoutChangeEvent) => {
          setBoardSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          });
        }}
      >
        {boardSize.width > 0 && boardSize.height > 0 ? (
          <Svg
            height={boardSize.height}
            pointerEvents="none"
            style={styles.overlay}
            width={boardSize.width}
          >
            {connections.map(c => (
              <Path
                d={c.d}
                fill="none"
                key={c.id}
                stroke={colors.pink}
                strokeWidth={2}
              />
            ))}
          </Svg>
        ) : null}

        <View
          style={styles.col}
          onLayout={(e: LayoutChangeEvent) => {
            const { x, y } = e.nativeEvent.layout;
            setLeftColOffset({ x, y });
          }}
        >
          {leftItems.map(leftItem => {
            const isSelected = selectedLeftId === leftItem.id;
            const connected = isLeftConnected(leftItem.id);
            return (
              <View
                key={leftItem.id}
                onLayout={(e: LayoutChangeEvent) => {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  setLeftLayoutById(prev => ({
                    ...prev,
                    [leftItem.id]: { x, y, width, height },
                  }));
                }}
              >
                <Pressable
                  style={[
                    styles.item,
                    connected ? styles.itemConnected : null,
                    isSelected ? styles.itemSelected : null,
                  ]}
                  onPress={() => onPressLeft(leftItem.id)}
                >
                  {leftItem.imageUrl ? (
                    <FullWidthFastImage uri={leftItem.imageUrl} />
                  ) : (
                    <Text size={14}>{leftItem.text}</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>

        <View
          style={styles.col}
          onLayout={(e: LayoutChangeEvent) => {
            const { x, y } = e.nativeEvent.layout;
            setRightColOffset({ x, y });
          }}
        >
          {rightItems.map(rightItem => {
            const isSelected = selectedRightId === rightItem.id;
            const connected = isRightConnected(rightItem.id);
            return (
              <View
                key={rightItem.id}
                onLayout={(e: LayoutChangeEvent) => {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  setRightLayoutById(prev => ({
                    ...prev,
                    [rightItem.id]: { x, y, width, height },
                  }));
                }}
              >
                <Pressable
                  style={[
                    styles.item,
                    connected ? styles.itemConnected : null,
                    isSelected ? styles.itemSelected : null,
                  ]}
                  onPress={() => onPressRight(rightItem.id)}
                >
                  {rightItem.imageUrl ? (
                    <FullWidthFastImage uri={rightItem.imageUrl} />
                  ) : (
                    <Text size={14}>{rightItem.text}</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      <Button
        disabled={!allMatched || isCorrect != null}
        title={t('check')}
        onPress={answer}
      />

      {isCorrect != null && (
        <AnswerResult
          buttonText={slide.variants[0].buttonText || ''}
          isCorrect={isCorrect}
          content={
            isCorrect
              ? slide.variants[0].explanation
              : slide.variants[0].wrongExplanation
          }
          onClose={() => setIsCorrect(null)}
          onPressNext={handleGoToNextSlide}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  col: {
    flex: 1,
    gap: DEFAULT_SPACE,
  },
  item: {
    borderWidth: 1,
    borderColor: colors.pink,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: DEFAULT_SPACE,
  },
  itemConnected: {
    borderWidth: 2,
  },
  itemSelected: {
    borderColor: colors.black,
    borderWidth: 2,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DEFAULT_SPACE * 4,
    position: 'relative',
  },
});
