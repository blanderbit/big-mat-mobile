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
  routes: {
    id: string;
    locked: boolean;
    order: number;
    subtitle: string;
    title: string;
    progress: {
      completedAt: null | string;
      lastSlideOrder: number;
      status: 'not_started';
    };
  }[];
};

export enum SlideType {
  SINGLE_CHOICE = 'single_choice',
  STORY = 'story',
  MULTIPLE_CHOICE = 'multiple_choice',
  DRAG_DROP = 'drag_drop',
  FRACTION_INPUT = 'fraction_input',
  FRACTION_SLIDER = 'fraction_slider',
  COMIC = 'comic',
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
  [SlideType.STORY]: {
    id: string;
    imageUrl?: string;
    text: { content: { content: { text: string }[] }[] };
    buttonText?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageFit?: 'contain' | 'cover';
    imagePosition?: 'top' | 'inline' | 'bottom';
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
  [SlideType.COMIC]: {
    id: string;
    nativeKey:
      | 'comic_1'
      | 'comic_2'
      | 'comic_3'
      | 'comic_4'
      | 'comic_5'
      | 'comic_6';
  };
};

export type SlideTypeWithVariants = keyof SlideVariantsByType;

export type Slide<TType extends SlideTypeWithVariants = SlideTypeWithVariants> =
  {
    id: string;
    order: number;
    points: number;
    type: TType;
    variants: SlideVariantsByType[TType][];
  };
