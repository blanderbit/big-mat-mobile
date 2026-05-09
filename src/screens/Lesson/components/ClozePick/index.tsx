import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { Wrapper } from '@components/Wrapper';

import { Block, GapPickBlock, Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.CLOZE_PICK>;
  lessonId: string;
};

export const ClozePick = ({ slide, lessonId }: Props) => {
  const variant = slide.variants[0];
  const { t } = useTranslation();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const [selectedOptionIdByBlockIndex, setSelectedOptionIdByBlockIndex] =
    useState<Record<number, string | null>>({});

  const isGapPick = (v: unknown): v is GapPickBlock => {
    return (
      v != null &&
      typeof v === 'object' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v as any).type === 'gap_pick'
    );
  };

  const blocks = useMemo(() => {
    const input = variant.blocks ?? [];
    return input.filter((b): b is Block => !isGapPick(b));
  }, [variant.blocks]);

  const correctOptionIdByBlockIndex = useMemo(() => {
    // Связываем каждый Block с ближайшим следующим gap_pick (в исходном variant.blocks)
    const input = variant.blocks ?? [];
    const correctIds: string[] = [];

    for (let i = 0; i < input.length; i += 1) {
      const current = input[i];
      if (isGapPick(current)) continue;

      const nextGap = input.slice(i + 1).find(isGapPick);
      correctIds.push(nextGap?.correctOptionId ?? '');
    }

    return correctIds;
  }, [variant.blocks]);

  const hasAnyUnselectedDropdown = useMemo(() => {
    return blocks.some((_, idx) => selectedOptionIdByBlockIndex[idx] == null);
  }, [blocks, selectedOptionIdByBlockIndex]);

  const answer = () => {
    const ok = blocks.every((_, idx) => {
      const selected = selectedOptionIdByBlockIndex[idx];
      const correct = correctOptionIdByBlockIndex[idx];
      return selected != null && correct.length > 0 && selected === correct;
    });

    setIsCorrect(ok);
  };

  return (
    <Wrapper>
      <Blocks
        blocks={blocks}
        renderGapPickOptions={variant.gapPickOptions}
        renderGapPickValueByBlockIndex={selectedOptionIdByBlockIndex}
        onRenderGapPickChange={(blockIndex, optionId) => {
          setSelectedOptionIdByBlockIndex(prev => ({
            ...prev,
            [blockIndex]: optionId,
          }));
        }}
      />

      <Button
        disabled={hasAnyUnselectedDropdown || isCorrect != null || isLoading}
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
