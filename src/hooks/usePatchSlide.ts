import { useState } from 'react';

import { API } from '@API/index';
import { useLessonsStore } from '@stores/lessonsStore';

export const usePatchSlide = ({
  lessonId,
  slideId,
  isCorrect,
  setIsCorrect,
}: {
  lessonId: string;
  slideId: string;
  isCorrect: boolean | null;
  setIsCorrect?: (isCorrect: boolean | null) => void;
}) => {
  const [triesCount, setTriesCount] = useState(1);
  const goToNextSlide = useLessonsStore(state => state.goToNextSlide);
  const slides = useLessonsStore(state => state.slides);

  const setAnswerResult = (correct: boolean) => {
    if (!correct) {
      setTriesCount(prev => prev + 1);
    }
    setIsCorrect?.(correct);
  };

  const handleGoToNextSlide = async () => {
    const currentSlide = slides.find(slide => slide.id === slideId);
    const lastContentSlide = slides
      .slice()
      .reverse()
      .find(slide => slide.type !== 'finish' && slide.order != null);
    const lastSlideOrder =
      currentSlide?.order ?? lastContentSlide?.order ?? undefined;

    try {
      await API.patch(`/v1/progress/routes/${lessonId}`, {
        ...(lastSlideOrder != null ? { lastSlideOrder } : {}),
        attempt: {
          slideId: slideId,
          isCorrect: !!isCorrect,
          optionsCount: triesCount,
        },
      });
    } catch {
      // Keep UX moving; progress sync is best-effort.
    }

    if (isCorrect) {
      goToNextSlide();
    } else {
      setIsCorrect?.(null);
    }
  };

  return {
    handleGoToNextSlide,
    setAnswerResult,
  };
};
