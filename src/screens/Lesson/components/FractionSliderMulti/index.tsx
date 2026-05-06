import { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.FRACTION_SLIDER_MULTI>;
  lessonId: string;
};
const TOGGLER_WIDTH = 16;
const TOGGLER_HEIGHT = 50;
const TRACK_BORDER = 2;

const parseFraction = (label: string) => {
  const [nRaw, dRaw] = label.split('/');
  const n = Number(nRaw);
  const d = Number(dRaw);
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
  return n / d;
};

type SlideVariantsTask =
  Slide<SlideType.FRACTION_SLIDER_MULTI>['variants'][number]['tasks'][number];

const FractionSliderTask = ({
  onChangeOptionId,
  task,
  chosenOptionId,
}: {
  task: SlideVariantsTask;
  chosenOptionId: string | undefined;
  onChangeOptionId: (optionId: string) => void;
}) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const parsedOptions = useMemo(() => {
    const parsed = task.options
      .map(o => {
        const v = parseFraction(o.label);
        return v == null ? null : { id: o.id, label: o.label, value: v };
      })
      .filter(
        (
          o,
        ): o is {
          id: string;
          label: SlideVariantsTask['options'][number]['label'];
          value: number;
        } => o != null,
      )
      .sort((a, b) => a.value - b.value);
    // Fallback so we never crash on empty/invalid config.
    return parsed.length
      ? parsed
      : [{ id: '__fallback__', label: '0/1', value: 0 }];
  }, [task.options]);

  const min = parsedOptions[0].value;
  const max = parsedOptions[parsedOptions.length - 1].value;
  const range = max - min || 1;

  useEffect(() => {
    if (chosenOptionId == null && parsedOptions.length) {
      onChangeOptionId(parsedOptions[0].id);
    }
  }, [chosenOptionId, onChangeOptionId, parsedOptions]);

  const chosenValue =
    chosenOptionId != null
      ? parsedOptions.find(o => o.id === chosenOptionId)?.value
      : undefined;

  const resolvedValue = chosenValue ?? parsedOptions[0].value;
  const progress = (Math.max(min, Math.min(max, resolvedValue)) - min) / range;
  const innerWidth = Math.max(0, trackWidth - TRACK_BORDER * 2);

  const getNearestOption = (v: number) => {
    let best = parsedOptions[0];
    let bestDist = Math.abs(v - best.value);
    for (const opt of parsedOptions) {
      const dist = Math.abs(v - opt.value);
      if (dist < bestDist) {
        best = opt;
        bestDist = dist;
      }
    }
    return best;
  };

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const setValueByX = (x: number) => {
    if (trackWidth <= 0) return;
    const t = Math.max(0, Math.min(1, x / trackWidth));
    const v = min + t * range;
    onChangeOptionId(getNearestOption(v).id);
  };

  const endDrag = () => {
    // No-op: we already snap while dragging (nearest option).
  };

  const renderSlider = () => {
    const minTogglerLeft = -TRACK_BORDER;
    const maxTogglerLeft = Math.max(minTogglerLeft, trackWidth - TOGGLER_WIDTH);

    const togglerLeft =
      trackWidth > 0
        ? Math.max(
            minTogglerLeft,
            Math.min(
              maxTogglerLeft,
              minTogglerLeft + progress * (maxTogglerLeft - minTogglerLeft),
            ),
          )
        : minTogglerLeft;

    return (
      <View style={styles.sliderOuter}>
        <View
          style={styles.sliderTrack}
          onLayout={onTrackLayout}
          onMoveShouldSetResponderCapture={() => true}
          onResponderGrant={e => setValueByX(e.nativeEvent.locationX)}
          onResponderMove={e => setValueByX(e.nativeEvent.locationX)}
          onResponderRelease={endDrag}
          onResponderTerminate={endDrag}
          onStartShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
        >
          <View pointerEvents="none" style={styles.fillClip}>
            <View
              style={[
                styles.trackFill,
                {
                  width: progress * innerWidth,
                },
              ]}
            />
          </View>

          <View pointerEvents="none" style={styles.ticksLayer}>
            {trackWidth > 0
              ? parsedOptions.map((opt, idx) => {
                  // Hide the very first/last ticks to match the design (edge is a border).
                  if (idx === 0 || idx === parsedOptions.length - 1)
                    return null;
                  const t = (opt.value - min) / range;
                  const left =
                    TRACK_BORDER + Math.max(0, Math.min(1, t)) * innerWidth;
                  return (
                    <View
                      key={`${task.id}-tick-${opt.id}`}
                      style={[styles.tick, { left }]}
                    />
                  );
                })
              : null}
          </View>

          <View
            pointerEvents="none"
            style={[styles.toggler, { left: togglerLeft }]}
          >
            <View style={styles.togglerPill} />
          </View>
        </View>
      </View>
    );
  };

  switch (task.layout) {
    case 'image_left_slider_right':
      return (
        <View style={styles.row}>
          {task.imageUrl ? (
            <View style={styles.imageCol}>
              <FullWidthFastImage uri={task.imageUrl} />
            </View>
          ) : null}
          <View style={styles.sliderCol}>{renderSlider()}</View>
        </View>
      );
    case 'image_right_slider_left':
      return (
        <View style={styles.row}>
          <View style={styles.sliderCol}>{renderSlider()}</View>
          {task.imageUrl ? (
            <View style={styles.imageCol}>
              <FullWidthFastImage uri={task.imageUrl} />
            </View>
          ) : null}
        </View>
      );
    case 'image_top_slider_bottom':
      return (
        <View style={styles.col}>
          {task.imageUrl ? (
            <View style={styles.imageTop}>
              <FullWidthFastImage uri={task.imageUrl} />
            </View>
          ) : null}
          <View style={styles.sliderBottom}>{renderSlider()}</View>
        </View>
      );
  }
};

export const FractionSliderMulti = ({ slide, lessonId }: Props) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [chosenOptionIdByTaskId, setChosenOptionIdByTaskId] = useState<
    Record<string, string>
  >({});
  const { t } = useTranslation();

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const answer = () => {
    const tasks = slide.variants[0].tasks;
    const allAnswered = tasks.every(
      task => chosenOptionIdByTaskId[task.id] != null,
    );
    if (!allAnswered) return;

    const allCorrect = tasks.every(task => {
      const chosenId = chosenOptionIdByTaskId[task.id];
      return (
        chosenId != null &&
        task.correctOptionIds.includes(chosenId) &&
        (task.correctOptionIds.length !== 1 ||
          task.correctOptionIds[0] === chosenId)
      );
    });

    setIsCorrect(allCorrect);
  };

  return (
    <Wrapper>
      {slide.variants[0].introBlocks && (
        <Blocks blocks={slide.variants[0].introBlocks} />
      )}

      {slide.variants[0].tasks.map(task => {
        return (
          <View key={task.id} style={styles.taskCard}>
            <FractionSliderTask
              chosenOptionId={chosenOptionIdByTaskId[task.id]}
              task={task}
              onChangeOptionId={optionId =>
                setChosenOptionIdByTaskId(prev => ({
                  ...prev,
                  [task.id]: optionId,
                }))
              }
            />
          </View>
        );
      })}

      <Button
        disabled={isCorrect != null}
        title={t('check')}
        onPress={answer}
      />

      {isCorrect != null && (
        <AnswerResult
          buttonText={slide.variants[0].buttonText || ''}
          disabled={isLoading}
          isCorrect={isCorrect}
          isLoading={isLoading}
          content={
            isCorrect
              ? slide.variants[0].explanation
              : slide.variants[0].wrongExplanation
          }
          onPressNext={handleGoToNextSlide}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    gap: 12,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  col: {
    flexDirection: 'column',
    gap: 12,
  },
  imageCol: {
    width: '30%',
  },
  sliderCol: {
    flex: 1,
  },
  imageTop: {
    width: '50%',
    alignSelf: 'center',
  },
  sliderBottom: {
    width: '100%',
  },
  sliderOuter: {
    width: '100%',
    paddingVertical: 6,
  },
  sliderTrack: {
    position: 'relative',
    height: 44,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#111111',
    justifyContent: 'center',
  },
  fillClip: {
    position: 'absolute',
    left: TRACK_BORDER,
    right: TRACK_BORDER,
    top: TRACK_BORDER,
    bottom: TRACK_BORDER,
    overflow: 'hidden',
    borderRadius: 2,
  },
  trackFill: {
    height: '100%',
    backgroundColor: colors.green,
  },
  toggler: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  togglerPill: {
    width: TOGGLER_WIDTH,
    height: TOGGLER_HEIGHT,
    backgroundColor: '#0B2B4D',
    borderRadius: TOGGLER_WIDTH / 2,
  },
  ticksLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  tick: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    width: 2,
    backgroundColor: '#111111',
  },
});
