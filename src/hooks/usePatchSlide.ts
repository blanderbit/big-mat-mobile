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
  setIsCorrect?: (isCorrect: null) => void;
}) => {
  const [triesCount, setTriesCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const goToNextSlide = useLessonsStore(state => state.goToNextSlide);
  const slides = useLessonsStore(state => state.slides);

  const handleGoToNextSlide = async () => {
    if (isCorrect) {
      setIsLoading(true);

      await API.patch(`/v1/progress/routes/${lessonId}`, {
        lastSlideOrder: slides[slides.length - 2].order,
        attempt: {
          slideId: slideId,
          isCorrect: true,
          optionsCount: triesCount,
        },
      });
      setIsLoading(false);
      goToNextSlide();
    } else {
      setTriesCount(prev => prev + 1);
      setIsCorrect?.(null);
    }
  };

  return {
    handleGoToNextSlide,
    isLoading,
  };
};
