import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
  type View as ViewType,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { FullWidthFastImage } from '@components/FullWidthFastImage';
import { SizedFastImage } from '@components/SizedFastImage';
import { Text } from '@components/Text';
import { Wrapper } from '@components/Wrapper';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';
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

const SliderOptionLabel = ({
  isActive,
  label,
  left,
}: {
  isActive: boolean;
  label: string;
  left: number;
}) => {
  const color = isActive ? colors.black : colors.darkGrey;
  const parts = label.split('/');

  return (
    <View style={[styles.optionLabel, { left }]}>
      {parts.length === 2 ? (
        <>
          <Text center bold={isActive} color={color} size={14}>
            {parts[0]}
          </Text>
          <View
            style={[styles.optionLabelDivider, { backgroundColor: color }]}
          />
          <Text center bold={isActive} color={color} size={14}>
            {parts[1]}
          </Text>
        </>
      ) : (
        <Text center bold={isActive} color={color} size={14}>
          {label}
        </Text>
      )}
    </View>
  );
};

type SlideVariantsTask =
  Slide<SlideType.FRACTION_SLIDER_MULTI>['variants'][number]['tasks'][number];

const getTaskImageStyle = (imageStyle: SlideVariantsTask['imageStyle']) => {
  if (!imageStyle) return styles.taskImageDefault;
  return {
    borderRadius: imageStyle.radius ?? 0,
    height: imageStyle.height,
    width: imageStyle.width,
  };
};

const getImageSpacingStyle = (
  imageSpacing: SlideVariantsTask['imageSpacing'],
) => {
  if (!imageSpacing) return null;
  return {
    marginTop: imageSpacing.margin?.top,
    marginRight: imageSpacing.margin?.right,
    marginBottom: imageSpacing.margin?.bottom,
    marginLeft: imageSpacing.margin?.left,
    paddingTop: imageSpacing.padding?.top,
    paddingRight: imageSpacing.padding?.right,
    paddingBottom: imageSpacing.padding?.bottom,
    paddingLeft: imageSpacing.padding?.left,
  } as const;
};

const renderSideImage = (task: SlideVariantsTask) => {
  if (!task.imageUrl) return null;

  const spacingStyle = getImageSpacingStyle(task.imageSpacing);
  const content = (
    <View style={styles.sideImageBox}>
      <SizedFastImage
        height={50}
        resizeMode="contain"
        uri={task.imageUrl}
        width={40}
      />
    </View>
  );

  return spacingStyle ? <View style={spacingStyle}>{content}</View> : content;
};

const getDefaultOptionId = (
  task: SlideVariantsTask,
  defaultOptionIndex?: number,
) => {
  if (
    defaultOptionIndex == null ||
    defaultOptionIndex < 0 ||
    defaultOptionIndex >= task.options.length
  ) {
    return undefined;
  }
  return task.options[defaultOptionIndex].id;
};

const FractionSliderTask = ({
  defaultOptionIndex,
  hideFractionLabels,
  onChangeOptionId,
  task,
  chosenOptionId,
}: {
  task: SlideVariantsTask;
  defaultOptionIndex?: number;
  hideFractionLabels?: boolean;
  chosenOptionId: string | undefined;
  onChangeOptionId: (optionId: string) => void;
}) => {
  const isDisabled = task.disabled;
  const trackRef = useRef<ViewType | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackPageX, setTrackPageX] = useState(0);

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
    if (chosenOptionId != null || !parsedOptions.length) return;

    const effectiveDefaultOptionIndex =
      task.defaultOptionIndex ?? defaultOptionIndex;
    const defaultId = getDefaultOptionId(task, effectiveDefaultOptionIndex);
    const initialId =
      defaultId != null && parsedOptions.some(o => o.id === defaultId)
        ? defaultId
        : parsedOptions[0].id;

    onChangeOptionId(initialId);
  }, [
    chosenOptionId,
    defaultOptionIndex,
    onChangeOptionId,
    parsedOptions,
    task,
  ]);

  const chosenValue =
    chosenOptionId != null
      ? parsedOptions.find(o => o.id === chosenOptionId)?.value
      : undefined;

  const resolvedValue = chosenValue ?? parsedOptions[0].value;
  const progress = (Math.max(min, Math.min(max, resolvedValue)) - min) / range;
  const innerWidth = Math.max(0, trackWidth - TRACK_BORDER * 2);

  const getNearestOption = useCallback(
    (v: number) => {
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
    },
    [parsedOptions],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
    trackRef.current?.measureInWindow(x => setTrackPageX(x));
  };

  const setValueByX = useCallback(
    (x: number) => {
      if (isDisabled || trackWidth <= 0) return;
      const t = Math.max(0, Math.min(1, x / trackWidth));
      const v = min + t * range;
      onChangeOptionId(getNearestOption(v).id);
    },
    [getNearestOption, isDisabled, min, onChangeOptionId, range, trackWidth],
  );

  const panResponder = useMemo(() => {
    if (isDisabled) return null;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: e => {
        setValueByX(e.nativeEvent.pageX - trackPageX);
      },
      onPanResponderMove: (_e, gestureState) => {
        setValueByX(gestureState.moveX - trackPageX);
      },
    });
  }, [isDisabled, setValueByX, trackPageX]);

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

    const fillWidth =
      trackWidth > 0
        ? Math.max(0, Math.min(trackWidth, togglerLeft + TOGGLER_WIDTH))
        : 0;

    return (
      <View style={[styles.sliderOuter, isDisabled && styles.sliderDisabled]}>
        {!hideFractionLabels ? (
          <View pointerEvents="none" style={styles.labelsLayer}>
            {trackWidth > 0
              ? parsedOptions.map(opt => {
                  const t = (opt.value - min) / range;
                  const left =
                    TRACK_BORDER + Math.max(0, Math.min(1, t)) * innerWidth;
                  const isActive = opt.id === chosenOptionId;
                  return (
                    <SliderOptionLabel
                      isActive={isActive}
                      key={`${task.id}-label-${opt.id}`}
                      label={opt.label}
                      left={left}
                    />
                  );
                })
              : null}
          </View>
        ) : null}

        <View
          pointerEvents={isDisabled ? 'none' : 'auto'}
          ref={trackRef}
          style={styles.sliderTrack}
          onLayout={onTrackLayout}
          {...(panResponder?.panHandlers ?? {})}
        >
          <View pointerEvents="none" style={styles.fillClip}>
            <View style={[styles.trackFill, { width: fillWidth }]} />
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
          {renderSideImage(task)}
          <View style={styles.sliderCol}>{renderSlider()}</View>
        </View>
      );
    case 'image_right_slider_left':
      return (
        <View style={styles.row}>
          <View style={styles.sliderCol}>{renderSlider()}</View>
          {renderSideImage(task)}
        </View>
      );
    case 'image_top_slider_bottom':
      return (
        <View style={styles.col}>
          {task.imageUrl ? (
            <View
              style={[styles.imageTop, getImageSpacingStyle(task.imageSpacing)]}
            >
              <FullWidthFastImage
                style={getTaskImageStyle(task.imageStyle)}
                uri={task.imageUrl}
              />
            </View>
          ) : null}
          <View style={styles.sliderBottom}>{renderSlider()}</View>
        </View>
      );
  }
};

const buildInitialChoices = (
  tasks: Slide<SlideType.FRACTION_SLIDER_MULTI>['variants'][number]['tasks'],
  fallbackDefaultOptionIndex?: number,
) => {
  const initial: Record<string, string> = {};

  for (const task of tasks) {
    const optionId = getDefaultOptionId(
      task,
      task.defaultOptionIndex ?? fallbackDefaultOptionIndex,
    );
    if (optionId) initial[task.id] = optionId;
  }
  return initial;
};

export const FractionSliderMulti = ({ slide, lessonId }: Props) => {
  const variant = slide.variants[0];
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [chosenOptionIdByTaskId, setChosenOptionIdByTaskId] = useState(() =>
    buildInitialChoices(variant.tasks, variant.defaultOptionIndex),
  );
  const { t } = useTranslation();

  const { handleGoToNextSlide, setAnswerResult } = usePatchSlide({
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

    setAnswerResult(allCorrect);
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
              defaultOptionIndex={variant.defaultOptionIndex}
              hideFractionLabels={variant.hideFractionLabels}
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
  sideImageBox: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  sliderCol: {
    flex: 1,
  },
  imageTop: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  taskImageDefault: {
    width: 120,
    height: 120,
    borderRadius: 0,
  },
  sliderBottom: {
    width: '100%',
  },
  sliderOuter: {
    width: '100%',
    paddingVertical: 6,
  },
  sliderDisabled: {
    opacity: 0.5,
  },
  labelsLayer: {
    position: 'relative',
    width: '100%',
    height: 40,
    marginBottom: DEFAULT_SPACE,
  },
  optionLabel: {
    position: 'absolute',
    top: 0,
    width: 36,
    marginLeft: -18,
    alignItems: 'center',
  },
  optionLabelDivider: {
    width: 14,
    height: 1.5,
    marginVertical: 2,
    borderRadius: 0.5,
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
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
