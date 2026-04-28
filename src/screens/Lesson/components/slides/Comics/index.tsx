import { Comics1 } from '@screens/Lesson/components/slides/Comics/components/Comics1';
import { Wrapper } from '@screens/Lesson/components/Wrapper';

import { Slide, SlideType } from '@extra/types';

type Props = {
  slide: Slide<SlideType.COMIC>;
  lessonId: string;
};

export const Comics = ({ lessonId, slide }: Props) => {
  console.log('Comics slide', slide);

  const getComicComponent = () => {
    switch (slide.variants[0].nativeKey) {
      case 'comic_1':
        return <Comics1 key={slide.id} lessonId={lessonId} slide={slide} />;
      default:
        return null;
    }
  };

  const ComicComponent = getComicComponent();

  return <Wrapper>{ComicComponent}</Wrapper>;
};
