import { Comics1 } from '@screens/Lesson/components/slides/Comics/components/Comics1';
import { Wrapper } from '@screens/Lesson/components/Wrapper';

import { Slide, SlideType } from '@extra/types';

type Props = {
  slide: Slide<SlideType.COMIC>;
};

export const Comics = ({ slide }: Props) => {
  console.log('Comics slide', slide);

  const getComicComponent = () => {
    switch (slide.variants[0].nativeKey) {
      case 'comic_1':
        return <Comics1 key={slide.id} />;
      default:
        return null;
    }
  };

  const ComicComponent = getComicComponent();

  return <Wrapper>{ComicComponent}</Wrapper>;
};
