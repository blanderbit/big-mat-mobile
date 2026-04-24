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
