import { create } from 'zustand';

import { Slide } from '@extra/types';

type LessonsStore = {
  slides: Slide[];
  setSlides: (lessons: Slide[]) => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: (currentSlideIndex: number) => void;
  goToNetSlide: () => void;
};

export const useLessonsStore = create<LessonsStore>((set, get) => ({
  slides: [],
  setSlides: (slides: Slide[]) => set({ slides }),
  currentSlideIndex: 0,
  setCurrentSlideIndex: (currentSlideIndex: number) =>
    set({ currentSlideIndex }),
  goToNetSlide: () => {
    if (get().currentSlideIndex < get().slides.length - 1) {
      set(state => ({ currentSlideIndex: state.currentSlideIndex + 1 }));
    }
  },
}));
