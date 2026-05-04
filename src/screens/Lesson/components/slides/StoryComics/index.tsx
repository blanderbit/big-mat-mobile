import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Carousel } from '@components/Carousel';
import { Text } from '@components/Text';
import { WebView } from '@components/WebView';

import { CAROUSEL_MAX_HEIGHT, DEFAULT_SPACE } from '@extra/constants';
import {
  Block,
  ContainerBlock,
  DescriptionTextBlock,
  DescriptionTextBoxBlock,
  ImageBlock,
  Slide,
  SliderBlock,
  SlideType,
  TextBlock,
  TitleBlock,
} from '@extra/types';
import { usePatchSlide } from '@hooks/usePatchSlide';

type Props = {
  slide: Slide<SlideType.STORY_COMIC>;
  lessonId: string;
};

const TITLE_LEVEL_SIZE: Record<NonNullable<TitleBlock['level']>, number> = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 21,
  h5: 19,
  h6: 17,
};

const titleSizeFromLevel = (level: TitleBlock['level'] | undefined): number =>
  level != null ? TITLE_LEVEL_SIZE[level] : TITLE_LEVEL_SIZE.h3;

export const StoryComics = ({ slide, lessonId }: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [textBubbleY, setTextBubbleY] = useState<number | null>(null);
  const [notchBottom, setNotchBottom] = useState<number | null>(null);
  const [buttonTop, setButtonTop] = useState<number | null>(null);
  const { t } = useTranslation();
  const handleSetContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
    setContainerHeight(event.nativeEvent.layout.height);
  };
  const { bottom } = useSafeAreaInsets();

  const { handleGoToNextSlide, isLoading } = usePatchSlide({
    isCorrect: true,
    lessonId,
    slideId: slide.id,
  });

  console.log('StoryComics', slide);

  const renderImage = (imageData: ImageBlock) => {
    const imageRowAlignStyle =
      imageData.verticalAlign === 'left'
        ? styles.imageRowAlignStart
        : imageData.verticalAlign === 'center'
        ? styles.imageRowAlignCenter
        : styles.imageRowAlignEnd;

    return (
      <View style={imageRowAlignStyle}>
        <FastImage
          resizeMode="cover"
          source={{ uri: imageData.imageUrl ?? '' }}
          style={{
            width: imageData.width ?? '100%',
            height: imageData.height ?? '100%',
          }}
        />
      </View>
    );
  };

  const renderText = (textData: TextBlock, containerHeight?: number) => (
    <WebView containerHeight={containerHeight} html={textData.content} />
  );

  const renderTitle = (titleData: TitleBlock) => (
    <Text
      bold
      color={titleData.color}
      size={titleSizeFromLevel(titleData.level)}
      style={{ lineHeight: titleSizeFromLevel(titleData.level) }}
    >
      {titleData.value}
    </Text>
  );

  const renderDescriptionText = (
    descriptionTextData: DescriptionTextBlock,
    containerHeight?: number,
  ) => (
    <WebView
      color={descriptionTextData.color}
      containerHeight={containerHeight}
      html={descriptionTextData.content}
    />
  );

  const renderDescriptionTextBox = (
    descriptionTextBoxData: DescriptionTextBoxBlock,
    containerHeight?: number,
  ) => (
    <WebView
      backgroundColor={descriptionTextBoxData.background}
      borderRadius={descriptionTextBoxData.borderRadius}
      containerHeight={containerHeight}
      html={descriptionTextBoxData.content}
    />
  );

  const renderContainer = (containerData: ContainerBlock) => {
    return (
      <View
        style={[
          styles.containerBlockShell,
          {
            backgroundColor: containerData.background,
            borderRadius: containerData.borderRadius,
          },
        ]}
      >
        {renderBlocks(containerData.blocks ?? [])}
      </View>
    );
  };

  const renderSlider = (sliderData: SliderBlock) => {
    return (
      <Carousel
        autoPlay={sliderData.autoplay}
        items={sliderData.slides.map(slide => {
          switch (slide.type) {
            case 'image':
              return renderImage(slide as ImageBlock);
            case 'text':
              return renderText(slide as TextBlock, CAROUSEL_MAX_HEIGHT);
            case 'title':
              return renderTitle(slide as TitleBlock);
            case 'description_text':
              return renderDescriptionText(
                slide as DescriptionTextBlock,
                CAROUSEL_MAX_HEIGHT,
              );
            case 'description_text_box':
              return renderDescriptionTextBox(
                slide as DescriptionTextBoxBlock,
                CAROUSEL_MAX_HEIGHT,
              );
            case 'container':
              return renderContainer(slide as ContainerBlock);
            default:
              return null;
          }
        })}
      />
    );
  };

  const renderBlocks = (blocks: Block[]) => {
    return blocks?.map((block, index) => {
      const switchBlockType = () => {
        switch (block.type) {
          case 'image':
            return renderImage(block as ImageBlock);
          case 'text':
            return renderText(block as TextBlock);
          case 'title':
            return renderTitle(block as TitleBlock);
          case 'description_text':
            return renderDescriptionText(block as DescriptionTextBlock);
          case 'description_text_box':
            return renderDescriptionTextBox(block as DescriptionTextBoxBlock);
          case 'slider':
            return renderSlider(block as SliderBlock);
          case 'container':
            return renderContainer(block as ContainerBlock);
        }
      };

      const blockContent = switchBlockType();

      return <View key={`${slide.id}-${index}`}>{blockContent}</View>;
    });
  };

  const blocks = renderBlocks(slide.variants[0].blocks ?? []);

  return (
    <View style={styles.container} onLayout={handleSetContainerLayout}>
      {blocks}

      <View style={{ marginBottom: bottom }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: DEFAULT_SPACE,
  },
  imageRowAlignStart: {
    alignItems: 'flex-start',
  },
  imageRowAlignCenter: {
    alignItems: 'center',
  },
  imageRowAlignEnd: {
    alignItems: 'flex-end',
  },
  containerBlockShell: {
    marginHorizontal: -DEFAULT_SPACE,
    gap: DEFAULT_SPACE,
  },
});
