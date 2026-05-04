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
}

export enum DragDropItemType {
  BLOCK = 'block',
  IMAGE = 'image',
  NUMBER = 'number',
  TEXT = 'text',
}

export type DragDropItem =
  | { id: string; type: DragDropItemType.TEXT; text: string }
  | {
      id: string;
      type: DragDropItemType.IMAGE;
      imageUrl: string;
      alt: string;
    }
  | { id: string; type: DragDropItemType.NUMBER; value: number }
  | {
      id: string;
      type: DragDropItemType.BLOCK;
      label: string;
      color?: string;
      icon?: string;
    };

export type ImageBlock = {
  height?: number;
  imageUrl?: string;
  position?: number;
  type?: 'image';
  verticalAlign?: 'left' | 'center' | 'right';
  width?: number;
};

export type TextBlock = {
  content: string; // HTML string;
  position: number;
  type: 'text';
};

export type TitleBlock = {
  color?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  position: number;
  type: 'title';
  value?: string;
};

export type DescriptionTextBlock = {
  color?: string;
  content: string; // HTML string;
  position: number;
  type: 'description_text';
};

export type DescriptionTextBoxBlock = {
  background?: string;
  borderRadius?: number;
  color?: string;
  content: string; // HTML string;
  type: 'description_text_box';
};

export type SliderBlock = {
  autoplay: boolean;
  position: number;
  slides: Block[];
  type: 'slider';
};

export type ContainerBlock = {
  background?: string;
  blocks?: Block[];
  borderRadius?: number;
  position: number;
  type: 'container';
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
    buttonText: string;
    correctOptionIds: string[];
    explanation: {
      content: { content: { text: string }[] }[];
    };
    id: string;
    imageUrl: string;
    options: {
      id: string;
      imageUrl?: string;
      label: string;
    }[];
    optionsLayout: 'grid';
    questionImageUrl: string;
    questionText: {
      content: { content: { text: string }[] }[];
    };
    text: { content: { content: { text: string }[] }[] };
    wrongExplanation: { content: { content: { text: string }[] }[] };
  };
  [SlideType.STORY_COMIC]: {
    buttonText: string;
    id: string;
    blocks?: Block[];
  };
  [SlideType.MULTIPLE_CHOICE]: {
    correctOptionIds: string[];
    questionImageUrl: string;
    questionText: {
      content: { content: { text: string }[] }[];
    };
    optionsLayout?: 'grid' | 'list';
    options: {
      id: string;
      imageUrl?: string;
      label: string;
    }[];
    explanation: {
      content: { content: { text: string }[] }[];
    };
    wrongExplanation: { content: { content: { text: string }[] }[] };
  };
  [SlideType.FRACTION_SLIDER]: {
    correctOptionIds: string[];
    explanation: {
      content: { content: { text: string }[] }[];
    };
    id: string;
    options: {
      id: string;
      label: string;
    }[];
    questionImageUrl: string;
    questionText: {
      content: { content: { text: string }[] }[];
    };
    wrongExplanation: { content: { content: { text: string }[] }[] };
  };
  [SlideType.FRACTION_INPUT]: {
    correctNumerator: number;
    correctDenominator: number;
    id: string;
    questionImageUrl: string;
    questionText: {
      content: { content: { text: string }[] }[];
    };
    explanation: {
      content: { content: { text: string }[] }[];
    };
    wrongExplanation: { content: { content: { text: string }[] }[] };
  };
  [SlideType.DRAG_DROP]: {
    explanation: {
      content: { content: { text: string }[] }[];
    };
    wrongExplanation: { content: { content: { text: string }[] }[] };
    id: string;
    itemZoneMap: Record<string, string>;
    items: DragDropItem[];
    questionText: {
      content: { content: { text: string }[] }[];
    };
    zones: {
      id: string;
      label: string;
    }[];
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
