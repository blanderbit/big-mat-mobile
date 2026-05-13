import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { Carousel } from '@components/Carousel';
import { Text } from '@components/Text';
import { WebView } from '@components/WebView';

import { colors } from '@extra/colors';
import { CAROUSEL_MAX_HEIGHT, DEFAULT_SPACE } from '@extra/constants';
import {
  Block,
  ContainerBlock,
  DescriptionTextBlock,
  DescriptionTextBoxBlock,
  GapPickBlock,
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
  blocks: Array<Block | GapPickBlock>;
  renderGapPickOptions?: Array<{ id: string; label: string }>;
  renderGapPickValueByIndex?: Record<number, string | null | undefined>;
  onRenderGapPickChange?: (index: number, optionId: string) => void;
};

const GapPickDropdown = ({
  isOpen,
  onChange,
  onToggle,
  options,
  value,
}: {
  isOpen: boolean;
  options: Array<{ id: string; label: string }>;
  value: string | null | undefined;
  onChange: ((optionId: string) => void) | undefined;
  onToggle: () => void;
}) => {
  const { t } = useTranslation();
  const rotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const selectedLabel = value
    ? options.find(o => o.id === value)?.label ?? ''
    : '';

  const isDisabled = onChange == null;

  return (
    <View style={styles.gapPickWrap}>
      <Pressable
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.gapPickTrigger,
          isOpen ? styles.gapPickTriggerOpen : null,
          isDisabled ? styles.gapPickTriggerDisabled : null,
          pressed && !isDisabled ? styles.gapPickTriggerPressed : null,
        ]}
        onPress={onToggle}
      >
        <Text
          bold={!!selectedLabel}
          color={selectedLabel ? colors.black : '#9A9A9A'}
          size={18}
          style={styles.gapPickTriggerLabel}
        >
          {selectedLabel || t('selectOption')}
        </Text>
        <Animated.View
          style={[styles.chevronWrap, { transform: [{ rotate }] }]}
        >
          <View style={styles.chevron} />
        </Animated.View>
      </Pressable>

      {isOpen ? (
        <View style={styles.gapPickOptions}>
          {options.map((option, idx) => {
            const isSelected = option.id === value;
            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.gapPickOption,
                  idx === 0 ? styles.gapPickOptionFirst : null,
                  isSelected ? styles.gapPickOptionSelected : null,
                  pressed ? styles.gapPickOptionPressed : null,
                ]}
                onPress={() => {
                  onChange?.(option.id);
                }}
              >
                <Text bold={isSelected} size={18}>
                  {option.label}
                </Text>
                {isSelected ? <View style={styles.checkDot} /> : null}
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
  renderGapPickValueByIndex,
}: Props) => {
  const [openGapPickIndex, setOpenGapPickIndex] = useState<number | null>(null);
  const renderImage = (imageData: ImageBlock) => {
    const imageRowAlignStyle =
      imageData.verticalAlign === 'left'
        ? styles.imageRowAlignStart
        : imageData.verticalAlign === 'center'
        ? styles.imageRowAlignCenter
        : styles.imageRowAlignEnd;

    const uri = imageData.imageUrl ?? '';
    const isSvg = /\.svg(\?.*)?$/i.test(uri);
    const width = imageData.width ?? '100%';
    const height = imageData.height ?? '100%';

    return (
      <View style={[imageRowAlignStyle, getSpacingStyle(imageData.spacing)]}>
        {isSvg ? (
          <SvgUri height={height} uri={uri} width={width} />
        ) : (
          <FastImage
            resizeMode="cover"
            source={{ uri }}
            style={{ width, height }}
          />
        )}
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
    const serverPadding = containerData.spacing?.padding;
    const serverMargin = containerData.spacing?.margin;

    // Wrapper/ScrollView around slides applies horizontal padding of
    // DEFAULT_SPACE. Server-provided horizontal margins are interpreted as
    // "distance from screen edge", so we compensate that parent padding.
    const compensateHorizontal = (value: number | undefined) =>
      value != null ? value - DEFAULT_SPACE : undefined;

    return (
      <View
        style={[
          styles.containerBlockShell,
          {
            paddingTop: serverPadding?.top ?? DEFAULT_SPACE,
            paddingRight: serverPadding?.right ?? DEFAULT_SPACE,
            paddingBottom: serverPadding?.bottom ?? DEFAULT_SPACE,
            paddingLeft: serverPadding?.left ?? DEFAULT_SPACE,
            marginTop: serverMargin?.top,
            marginRight: compensateHorizontal(serverMargin?.right),
            marginBottom: serverMargin?.bottom,
            marginLeft: compensateHorizontal(serverMargin?.left),
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

  const renderBlocks = (blocks: Array<Block | GapPickBlock>) => {
    return blocks?.map((block, index) => {
      if (block.type === 'gap_pick') {
        return (
          <View key={index} style={getSpacingStyle(block.spacing)}>
            <GapPickDropdown
              isOpen={openGapPickIndex === index}
              options={renderGapPickOptions ?? []}
              value={renderGapPickValueByIndex?.[index] ?? null}
              onChange={
                onRenderGapPickChange
                  ? optionId => {
                      onRenderGapPickChange(index, optionId);
                      setOpenGapPickIndex(null);
                    }
                  : undefined
              }
              onToggle={() =>
                setOpenGapPickIndex(prev => (prev === index ? null : index))
              }
            />
          </View>
        );
      }

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

      return <View key={index}>{switchBlockType()}</View>;
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
  },
  gapPickWrap: {
    marginTop: DEFAULT_SPACE,
  },
  gapPickTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 16,
    paddingVertical: 12,
    paddingLeft: 18,
    paddingRight: 14,
    backgroundColor: colors.white,
  },
  gapPickTriggerOpen: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: colors.brightBeige,
  },
  gapPickTriggerPressed: {
    opacity: 0.85,
  },
  gapPickTriggerDisabled: {
    opacity: 0.5,
  },
  gapPickTriggerLabel: {
    flex: 1,
    paddingRight: 12,
  },
  chevronWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.black,
    transform: [{ rotate: '45deg' }],
    marginBottom: 3,
  },
  gapPickOptions: {
    marginTop: 6,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  gapPickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopWidth: 1.5,
    borderTopColor: colors.darkGrey,
    backgroundColor: colors.white,
  },
  gapPickOptionFirst: {
    borderTopWidth: 0,
  },
  gapPickOptionSelected: {
    backgroundColor: colors.brightYellow,
  },
  gapPickOptionPressed: {
    backgroundColor: colors.darkBeige,
  },
  checkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.black,
    marginLeft: 12,
  },
});
