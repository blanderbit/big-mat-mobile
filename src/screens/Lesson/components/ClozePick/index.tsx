import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnswerResult } from '@components/AnswerResult';
import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';
import { Wrapper } from '@components/Wrapper';

import { GapPickBlock, Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.CLOZE_PICK>;
  lessonId: string;
};

export const ClozePick = ({ slide, lessonId }: Props) => {
  const variant = slide.variants[0];
  const { t } = useTranslation();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { handleGoToNextSlide } = usePatchSlide({
    isCorrect,
    lessonId,
    slideId: slide.id,
    setIsCorrect,
  });

  const [selectedOptionIdByIndex, setSelectedOptionIdByIndex] = useState<
    Record<number, string | null>
  >({});

  const blocks = useMemo(() => variant.blocks ?? [], [variant.blocks]);

  const gapPickIndices = useMemo(() => {
    const indices: number[] = [];
    blocks.forEach((b, i) => {
      if (b.type === 'gap_pick') indices.push(i);
    });
    return indices;
  }, [blocks]);

  const hasAnyUnselectedDropdown = useMemo(() => {
    return gapPickIndices.some(i => selectedOptionIdByIndex[i] == null);
  }, [gapPickIndices, selectedOptionIdByIndex]);

  const answer = () => {
    const findLabel = (
      list: { id: string; label: string }[] | undefined,
      id: string | null | undefined,
    ) => (id != null ? list?.find(o => o.id === id)?.label ?? null : null);

    const ok = gapPickIndices.every(i => {
      const gap = blocks[i] as GapPickBlock;

      const selected = selectedOptionIdByIndex[i];
      if (selected == null) return false;

      const selectedLabel = findLabel(variant.gapPickOptions, selected);
      const correctLabel =
        findLabel(gap.options, gap.correctOptionId) ??
        findLabel(variant.gapPickOptions, gap.correctOptionId);

      return (
        selectedLabel != null &&
        correctLabel != null &&
        selectedLabel === correctLabel
      );
    });

    setIsCorrect(ok);
  };

  return (
    <Wrapper>
      <Blocks
        blocks={blocks}
        renderGapPickOptions={variant.gapPickOptions}
        renderGapPickValueByIndex={selectedOptionIdByIndex}
        onRenderGapPickChange={(index, optionId) => {
          setSelectedOptionIdByIndex(prev => ({
            ...prev,
            [index]: optionId,
          }));
        }}
      />

      <Button
        disabled={hasAnyUnselectedDropdown || isCorrect != null}
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
