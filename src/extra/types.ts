export type User = {
  firebase: {
    email: string;
    uid: string;
  };
  user: {
    createdAt: string;
    email: string;
    firebaseUid: string;
    id: string;
    isAdmin: boolean;
    name: string;
    updatedAt: string;
  };
};

export type Topic = {
  id: string;
  locked: boolean;
  order: number;
  title: string;
};

export type FractionString = `${number}/${number}`;

export type Lesson = {
  id: string;
  order: number;
  subtitle: string | null;
  title: string;
  topicId: string;
  locked: boolean;
};

export enum SlideType {
  SINGLE_CHOICE = 'single_choice',
  STORY_COMIC = 'story_comic',
  MULTIPLE_CHOICE = 'multiple_choice',
  DRAG_DROP = 'drag_drop',
  FRACTION_INPUT = 'fraction_input',
  FRACTION_SLIDER = 'fraction_slider',
  FINISH = 'finish',
  FRACTION_SLIDER_MULTI = 'fraction_slider_multi',
  NUMBER_ANSWER = 'number_answer',
  MATCH_JOIN = 'match_join',
}

export enum DragDropItemType {
  BLOCK = 'block',
  IMAGE = 'image',
  NUMBER = 'number',
  TEXT = 'text',
}

export type DragDropItem =
  | {
      id: string;
      type: DragDropItemType.TEXT;
      text: string;

      style?: {
        italic: boolean;
        underline: boolean;
        strike: boolean;
        color: string;
      };
    }
  | {
      id: string;
      type: DragDropItemType.IMAGE;
      imageUrl: string;
      alt: string;
      style?: { width?: number; height?: number; radius?: number };
    }
  | { id: string; type: DragDropItemType.NUMBER; value: number }
  | {
      id: string;
      type: DragDropItemType.BLOCK;
      label: string;
      color?: string;
      icon?: string;
    };

type Spacing = {
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};

export type ImageBlock = {
  height?: number;
  imageUrl?: string;
  position?: number;
  type?: 'image';
  verticalAlign?: 'left' | 'center' | 'right';
  width?: number;
  spacing?: Spacing;
};

export type TextBlock = {
  content: string; // HTML string;
  position: number;
  type: 'text';
  spacing?: Spacing;
};

export type TitleBlock = {
  color?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  position: number;
  type: 'title';
  value?: string;
  spacing?: Spacing;
};

export type DescriptionTextBlock = {
  color?: string;
  content: string; // HTML string;
  position: number;
  type: 'description_text';
  spacing?: Spacing;
};

export type DescriptionTextBoxBlock = {
  background?: string;
  borderRadius?: number;
  color?: string;
  content: string; // HTML string;
  type: 'description_text_box';
  spacing?: Spacing;
};

export type SliderBlock = {
  autoplay: boolean;
  position: number;
  slides: Block[];
  type: 'slider';
  spacing?: Spacing;
};

export type ContainerBlock = {
  background?: string;
  blocks?: Block[];
  borderRadius?: number;
  position: number;
  type: 'container';
  spacing?: Spacing;
};

export type Block =
  | ImageBlock
  | TextBlock
  | TitleBlock
  | DescriptionTextBlock
  | DescriptionTextBoxBlock
  | SliderBlock
  | ContainerBlock;

export type SlideVariantsByType = {
  [SlideType.SINGLE_CHOICE]: {
    descriptionBlocks?: Block[];
    buttonText: string;
    cardDesign?:
      | 'image_top_buttons_bottom'
      | 'image_and_button_combined'
      | 'block_as_button'
      | 'blocks_description_buttons';
    correctOptionIds: string[];
    explanation: string; // HTML string;
    id: string;
    optionBlockBackground?: string;
    optionImageBorderColor?: string;
    imageUrl?: string;
    options: {
      id: string;
      imageUrl?: string;
      label: string;
      imageStyle?: {
        height: number;
        radius: number;
        width: number;
      };
    }[];
    optionsLayout: 'grid' | 'list';
    questionImageUrl: string;
    questionText: string; // HTML string;
    text: { content: { content: { text: string }[] }[] };
    wrongExplanation: string; // HTML string;
  };
  [SlideType.STORY_COMIC]: {
    buttonText: string;
    id: string;
    blocks?: Block[];
  };
  [SlideType.MULTIPLE_CHOICE]: {
    buttonText?: string;
    correctOptionIds: string[];
    questionImageUrl?: string;
    // questionText: string; // HTML string;
    optionsLayout?: 'grid' | 'list';
    options: {
      id: string;
      imageUrl?: string;
      label: string;
    }[];
    explanation: string; // HTML string;
    wrongExplanation: string; // HTML string;
    id: string;
  };
  [SlideType.FRACTION_SLIDER]: {
    correctOptionIds: string[];
    explanation: string; // HTML string;
    id: string;
    options: {
      id: string;
      label: FractionString;
    }[];
    questionImageUrl?: string;
    questionText: string; // HTML string;
    wrongExplanation: string; // HTML string;
    buttonText?: string;
  };
  [SlideType.FRACTION_INPUT]: {
    blocks?: Block[];
    buttonText?: string;
    correctNumerator: number;
    correctDenominator: number;
    id: string;
    questionImageUrl: string;
    explanation: string; // HTML string;
    wrongExplanation: string; // HTML string;
  };
  [SlideType.DRAG_DROP]: {
    buttonText?: string;
    explanation: string; // HTML string;
    wrongExplanation: string; // HTML string;
    id: string;
    itemZoneMap: Record<string, string>;
    items: DragDropItem[];
    questionText: string; // HTML string;
    zones: {
      id: string;
      label: string;
      style?: {
        background?: string;
        backgroundImageHeight?: number;
        backgroundImageRadius?: number;
        backgroundImageUrl?: string;
        backgroundImageWidth?: number;
        textColor?: 'string';
      };
    }[];
  };
  [SlideType.FRACTION_SLIDER_MULTI]: {
    buttonText?: string;
    explanation: string; // HTML string;
    id: string;
    introBlocks?: Block[];
    tasks: {
      imageStyle?: {
        height: number;
        radius: number;
        width: number;
      };
      correctOptionIds: string[];
      id: string;
      imageUrl?: string;
      layout:
        | 'image_left_slider_right'
        | 'image_right_slider_left'
        | 'image_top_slider_bottom';
      options: {
        id: string;
        label: FractionString;
      }[];
    }[];
    wrongExplanation: string; // HTML string;
  };
  [SlideType.NUMBER_ANSWER]: {
    blocks?: Block[];
    numberAnswerSideImageSpacing?: {
      bottom: number;
      left: number;
      right: number;
      top: number;
    };
    numberAnswerSideImageStyle?: {
      height: number;
      radius: number;
      width: number;
    };
    numberAnswerMiddleBlock?: {
      spacing?: {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
      };
      text?: string;
      textStyle?: {
        color: string;
        italic: boolean;
        strike: boolean;
        underline: boolean;
      };
      imageStyle?: {
        height: number;
        radius: number;
        width: number;
      };
      imageUrl?: string;

      type: 'text' | 'image';
    };
    numberAnswerCorrectTitle: string;
    buttonText?: string;
    correctNumber?: number;
    explanation: string; // HTML string;
    wrongExplanation: string; // HTML string;
    id: string;
    numberAnswerLayout: 'blocks_below' | 'image_side' | 'columns';
    numberAnswerFields?: {
      correctNumber: number;
      id: string;
      label: string;
    }[];
    numberAnswerSideImagePosition?: 'left' | 'right';
    numberAnswerSideImageUrl?: string;
    numberAnswerLeftColumnFields?: {
      correctNumber: number;
      id: string;
      label: string;
    }[];
    numberAnswerRightColumnFields?: {
      correctNumber: number;
      id: string;
      label: string;
    }[];
  };
  [SlideType.MATCH_JOIN]: {
    buttonText?: string;
    explanation: string; // HTML string;
    wrongExplanation: string; // HTML string;
    id: string;
    introBlocks?: Block[];
    leftItems: {
      id: string;
      kind: 'text' | 'image';
      text?: string;
      imageUrl?: string;
    }[];
    rightItems: {
      id: string;
      kind: 'text' | 'image';
      text?: string;
      imageUrl?: string;
      matchesLeftId: string;
    }[];
    shuffleLeft: boolean;
    shuffleRight: boolean;
  };
  [SlideType.FINISH]: undefined;
};

export type SlideTypeWithVariants = keyof SlideVariantsByType;

export type Slide<TType extends SlideTypeWithVariants = SlideTypeWithVariants> =
  {
    id: string;
    order: number;
    points: number;
    type: TType;
    variants: SlideVariantsByType[TType][];
    backgroundColor: null | string;
  };
