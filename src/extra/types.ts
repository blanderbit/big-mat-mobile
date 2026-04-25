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

export type SlideVariantsByType = {
  [SlideType.SINGLE_CHOICE]: {
    buttonText: string;
    correctOptionIds: string[];
    explanation: {
      type: 'doc';
      content: { content: { text: string } }[];
    };
    id: string;
    imageUrl: string;
    options: {
      id: string;
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
  [SlideType.MULTIPLE_CHOICE]: {
    options: unknown[];
  };
  [SlideType.STORY]: {
    id: string;
    imageUrl: string;
    text: { content: { content: { text: string }[] }[] };
    buttonText?: string;
  };
  [SlideType.DRAG_DROP]: unknown;
  [SlideType.FRACTION_INPUT]: unknown;
  [SlideType.FRACTION_SLIDER]: unknown;
  [SlideType.COMIC]: unknown;
};

export type Slide<TType extends SlideType = SlideType> = {
  id: string;
  order: number;
  points: number;
  type: TType;
  variants: SlideVariantsByType[TType][];
};
