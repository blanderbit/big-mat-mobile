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

  const handleGoToNextSlide = () => {
    if (isCorrect) {
      void API.patch(`/v1/progress/routes/${lessonId}`, {
        lastSlideOrder: slides[slides.length - 2].order,
        attempt: {
          slideId: slideId,
          isCorrect: true,
          optionsCount: triesCount,
        },
      }).catch(() => {});
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
