import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Blocks } from '@components/Blocks';
import { Button } from '@components/Button';

import { DEFAULT_SPACE } from '@extra/constants';
import { Slide, SlideType } from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.STORY_COMIC>;
  lessonId: string;
};

export const StoryComics = ({ slide, lessonId }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect: true,
    lessonId,
    slideId: slide.id,
  });

  return (
    <View style={styles.container}>
      <Blocks blocks={slide.variants[0].blocks ?? []} />

      <Button
        disabled={isLoading}
        isLoading={isLoading}
        marginBottom={bottom}
        title={slide.variants[0].buttonText ?? t('next')}
        onPress={handleGoToNextSlide}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: DEFAULT_SPACE,
  },
});
