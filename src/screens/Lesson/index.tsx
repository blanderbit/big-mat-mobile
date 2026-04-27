import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { ScrollView } from '@components/ScrollView';
import { FractionSlider } from '@screens/Lesson/components/slides/FractionSlider';
import { MultipleOrSingleChoice } from '@screens/Lesson/components/slides/MultipleOrSingleChoice';
import { Story } from '@screens/Lesson/components/slides/Story';
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const response = await API.get(`/v1/content/routes/${lessonId}/slides`);
        setSlides(response.data.data.slides);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [lessonId, setSlides]);

  const getSlideComponent = () => {
    switch (currentSlide?.type) {
      case SlideType.STORY:
        return (
          <Story
            key={currentSlide.id}
            slide={currentSlide as Slide<SlideType.STORY>}
          />
        );
      case SlideType.MULTIPLE_CHOICE:
        return (
          <MultipleOrSingleChoice
            key={currentSlide.id}
            slide={currentSlide as Slide<SlideType.MULTIPLE_CHOICE>}
            type="multiple"
          />
        );
      case SlideType.SINGLE_CHOICE:
        return (
          <MultipleOrSingleChoice
            key={currentSlide.id}
            slide={currentSlide as Slide<SlideType.SINGLE_CHOICE>}
            type="single"
          />
        );
      case SlideType.FRACTION_SLIDER:
        return (
          <FractionSlider
            key={currentSlide.id}
            setScrollEnabled={setScrollEnabled}
            slide={currentSlide as Slide<SlideType.FRACTION_SLIDER>}
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
