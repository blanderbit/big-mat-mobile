import { create } from 'zustand';

import { Slide } from '@extra/types';

type LessonsStore = {
  slides: Slide[];
  setSlides: (lessons: Slide[]) => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: (currentSlideIndex: number) => void;
  goToNextSlide: () => void;
};

export const useLessonsStore = create<LessonsStore>(set => ({
  slides: [],
  setSlides: (slides: Slide[]) => set({ slides }),
  currentSlideIndex: 0,
  setCurrentSlideIndex: (currentSlideIndex: number) =>
    set({ currentSlideIndex }),
  goToNextSlide: () => {
    set(state => ({ currentSlideIndex: state.currentSlideIndex + 1 }));
  },
}));
