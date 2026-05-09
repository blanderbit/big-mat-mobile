import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

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
  SliderBlock,
  TextBlock,
  TitleBlock,
} from '@extra/types';

const getSpacingStyle = (spacing?: {
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
}) => {
  if (!spacing) return null;
  return {
    marginTop: spacing.margin?.top,
    marginRight: spacing.margin?.right,
    marginBottom: spacing.margin?.bottom,
    marginLeft: spacing.margin?.left,
    paddingTop: spacing.padding?.top,
    paddingRight: spacing.padding?.right,
    paddingBottom: spacing.padding?.bottom,
    paddingLeft: spacing.padding?.left,
  } as const;
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

type Props = {
  blocks: Block[];
  renderGapPickOptions?: Array<{ id: string; label: string }>;
  renderGapPickValueByBlockIndex?: Record<number, string | null | undefined>;
  onRenderGapPickChange?: (blockIndex: number, optionId: string) => void;
};

const GapPickDropdown = ({
  onChange,
  options,
  value,
}: {
  options: Array<{ id: string; label: string }>;
  value: string | null | undefined;
  onChange: ((optionId: string) => void) | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = value
    ? options.find(o => o.id === value)?.label ?? ''
    : '';

  const isDisabled = onChange == null;

  return (
    <View style={styles.gapPickWrap}>
      <Pressable
        disabled={isDisabled}
        style={[
          styles.gapPickTrigger,
          isDisabled ? styles.gapPickTriggerDisabled : null,
        ]}
        onPress={() => setIsOpen(v => !v)}
      >
        <Text bold size={18}>
          {selectedLabel || ' '}
        </Text>
      </Pressable>

      {isOpen ? (
        <View style={styles.gapPickOptions}>
          {options.map(option => {
            const isSelected = option.id === value;
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.gapPickOption,
                  isSelected ? styles.gapPickOptionSelected : null,
                ]}
                onPress={() => {
                  onChange?.(option.id);
                  setIsOpen(false);
                }}
              >
                <Text bold={isSelected} size={18}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export const Blocks = ({
  blocks,
  onRenderGapPickChange,
  renderGapPickOptions,
  renderGapPickValueByBlockIndex,
}: Props) => {
  const renderImage = (imageData: ImageBlock) => {
    const imageRowAlignStyle =
      imageData.verticalAlign === 'left'
        ? styles.imageRowAlignStart
        : imageData.verticalAlign === 'center'
        ? styles.imageRowAlignCenter
        : styles.imageRowAlignEnd;

    return (
      <View style={[imageRowAlignStyle, getSpacingStyle(imageData.spacing)]}>
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
    <View style={getSpacingStyle(textData.spacing)}>
      <WebView containerHeight={containerHeight} html={textData.content} />
    </View>
  );

  const renderTitle = (titleData: TitleBlock) => (
    <View style={getSpacingStyle(titleData.spacing)}>
      <Text
        bold
        color={titleData.color}
        size={titleSizeFromLevel(titleData.level)}
        style={{ lineHeight: titleSizeFromLevel(titleData.level) }}
      >
        {titleData.value}
      </Text>
    </View>
  );

  const renderDescriptionText = (
    descriptionTextData: DescriptionTextBlock,
    containerHeight?: number,
  ) => (
    <View style={getSpacingStyle(descriptionTextData.spacing)}>
      <WebView
        color={descriptionTextData.color}
        containerHeight={containerHeight}
        html={descriptionTextData.content}
      />
    </View>
  );

  const renderDescriptionTextBox = (
    descriptionTextBoxData: DescriptionTextBoxBlock,
    containerHeight?: number,
  ) => (
    <View style={getSpacingStyle(descriptionTextBoxData.spacing)}>
      <WebView
        backgroundColor={descriptionTextBoxData.background}
        borderRadius={descriptionTextBoxData.borderRadius}
        containerHeight={containerHeight}
        html={descriptionTextBoxData.content}
      />
    </View>
  );

  const renderContainer = (containerData: ContainerBlock) => {
    return (
      <View
        style={[
          styles.containerBlockShell,
          getSpacingStyle(containerData.spacing),
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
      <View style={getSpacingStyle(sliderData.spacing)}>
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
      </View>
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

      return (
        <View key={index}>
          {blockContent}
          {renderGapPickOptions ? (
            <GapPickDropdown
              options={renderGapPickOptions}
              value={renderGapPickValueByBlockIndex?.[index] ?? null}
              onChange={
                onRenderGapPickChange
                  ? optionId => onRenderGapPickChange(index, optionId)
                  : undefined
              }
            />
          ) : null}
        </View>
      );
    });
  };

  return renderBlocks(blocks ?? []);
};

const styles = StyleSheet.create({
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
    gap: DEFAULT_SPACE,
    padding: DEFAULT_SPACE,
  },
  gapPickWrap: {
    marginTop: DEFAULT_SPACE,
  },
  gapPickTrigger: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  gapPickTriggerDisabled: {
    opacity: 0.5,
  },
  gapPickOptions: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gapPickOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  gapPickOptionSelected: {
    backgroundColor: '#EDEDED',
  },
});
