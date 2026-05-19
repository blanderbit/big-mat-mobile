import { create } from 'zustand';

import { Slide } from '@extra/types';

type LessonsStore = {
  slides: Slide[];
  activeLessonId: string | null;
  slideProgressByLessonId: Record<string, number>;
  currentSlideIndex: number;
  prepareLesson: (lessonId: string) => void;
  setSlides: (slides: Slide[], lessonId: string) => void;
  setCurrentSlideIndex: (currentSlideIndex: number) => void;
  goToNextSlide: () => void;
};

const clampSlideIndex = (index: number, slidesLength: number) => {
  if (slidesLength <= 0) return 0;
  return Math.max(0, Math.min(index, slidesLength - 1));
};

export const useLessonsStore = create<LessonsStore>((set, get) => ({
  slides: [],
  activeLessonId: null,
  slideProgressByLessonId: {},
  currentSlideIndex: 0,

  prepareLesson: (lessonId: string) =>
    set(state => ({
      activeLessonId: lessonId,
      slides: [],
      currentSlideIndex: state.slideProgressByLessonId[lessonId] ?? 0,
    })),

  setSlides: (slides: Slide[], lessonId: string) =>
    set(state => {
      const savedIndex = state.slideProgressByLessonId[lessonId] ?? 0;
      const currentSlideIndex = clampSlideIndex(savedIndex, slides.length);

      return {
        slides,
        activeLessonId: lessonId,
        currentSlideIndex,
        slideProgressByLessonId: {
          ...state.slideProgressByLessonId,
          [lessonId]: currentSlideIndex,
        },
      };
    }),

  setCurrentSlideIndex: (currentSlideIndex: number) =>
    set(state => {
      const lessonId = state.activeLessonId;
      if (lessonId == null) {
        return { currentSlideIndex };
      }

      const clamped = clampSlideIndex(currentSlideIndex, state.slides.length);

      return {
        currentSlideIndex: clamped,
        slideProgressByLessonId: {
          ...state.slideProgressByLessonId,
          [lessonId]: clamped,
        },
      };
    }),

  goToNextSlide: () => {
    const state = get();
    const lessonId = state.activeLessonId;
    const next = clampSlideIndex(
      state.currentSlideIndex + 1,
      state.slides.length,
    );

    set({
      currentSlideIndex: next,
      slideProgressByLessonId:
        lessonId != null
          ? { ...state.slideProgressByLessonId, [lessonId]: next }
          : state.slideProgressByLessonId,
    });
  },
}));
