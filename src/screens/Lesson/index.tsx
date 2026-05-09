import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { ScrollView } from '@components/ScrollView';
import { ClozePick } from '@screens/Lesson/components/ClozePick';
import { DragDrop } from '@screens/Lesson/components/DragDrop';
import { Finish } from '@screens/Lesson/components/Finish';
import { FractionInput } from '@screens/Lesson/components/FractionInput';
import { FractionSlider } from '@screens/Lesson/components/FractionSlider';
import { FractionSliderMulti } from '@screens/Lesson/components/FractionSliderMulti';
import { MatchJoin } from '@screens/Lesson/components/MatchJoin';
import { MultipleChoice } from '@screens/Lesson/components/MultipleChoice';
import { SingleChoice } from '@screens/Lesson/components/SingleChoice';
import { StoryComics } from '@screens/Lesson/components/StoryComics';
import { WriteTheAnswer } from '@screens/Lesson/components/WriteTheAnswer';
import { routes } from '@navigation/extra/routes';
import { HomeStackParamList } from '@navigation/extra/types';

import { API } from '@API/index';
import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { useLessonsStore } from '@stores/lessonsStore';

type Props = {
  route: RouteProp<HomeStackParamList, typeof routes.home.LESSON>;
};

export const Lesson = ({ route }: Props) => {
  const { lessonId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const slides = useLessonsStore(state => state.slides);
  const currentSlideIndex = useLessonsStore(state => state.currentSlideIndex);
  const setSlides = useLessonsStore(state => state.setSlides);

  const currentSlide = slides[currentSlideIndex];

  console.log('currentSlide', currentSlide);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        await API.post(`/v1/progress/routes/${lessonId}/start`, {
          routeId: lessonId,
        });
        const response = await API.get(`/v1/content/routes/${lessonId}/slides`);
        const slides = response.data.data.slides;
        slides.push({
          type: SlideType.FINISH,
        });
        setSlides(slides);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [lessonId, setSlides]);

  const getSlideComponent = () => {
    switch (currentSlide?.type) {
      case SlideType.STORY_COMIC:
        return (
          <StoryComics
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.STORY_COMIC>}
          />
        );
      case SlideType.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.MULTIPLE_CHOICE>}
          />
        );
      case SlideType.SINGLE_CHOICE:
        return (
          <SingleChoice
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.SINGLE_CHOICE>}
          />
        );
      case SlideType.FRACTION_SLIDER:
        return (
          <FractionSlider
            key={currentSlide.id}
            lessonId={lessonId}
            setScrollEnabled={setScrollEnabled}
            slide={currentSlide as Slide<SlideType.FRACTION_SLIDER>}
          />
        );
      case SlideType.FRACTION_INPUT:
        return (
          <FractionInput
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.FRACTION_INPUT>}
          />
        );
      case SlideType.DRAG_DROP:
        return (
          <DragDrop
            key={currentSlide.id}
            lessonId={lessonId}
            setScrollEnabled={setScrollEnabled}
            slide={currentSlide as Slide<SlideType.DRAG_DROP>}
          />
        );
      case SlideType.FINISH:
        return <Finish key={currentSlide.id} lessonId={lessonId} />;
      case SlideType.FRACTION_SLIDER_MULTI:
        return (
          <FractionSliderMulti
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.FRACTION_SLIDER_MULTI>}
          />
        );
      case SlideType.NUMBER_ANSWER:
        return (
          <WriteTheAnswer
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.NUMBER_ANSWER>}
          />
        );
      case SlideType.MATCH_JOIN:
        return (
          <MatchJoin
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.MATCH_JOIN>}
          />
        );
      case SlideType.CLOZE_PICK:
        return (
          <ClozePick
            key={currentSlide.id}
            lessonId={lessonId}
            slide={currentSlide as Slide<SlideType.CLOZE_PICK>}
          />
        );
      default:
        return null;
    }
  };

  const SlideComponent = getSlideComponent();

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      key={currentSlideIndex}
      scrollEnabled={scrollEnabled}
    >
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.slide}>{SlideComponent}</View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: DEFAULT_SPACE,
    flexGrow: 1,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
  },
});
