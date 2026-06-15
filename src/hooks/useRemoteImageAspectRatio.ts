import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { DEFAULT_REMOTE_IMAGE_ASPECT_RATIO } from '@extra/constants';

export const useRemoteImageAspectRatio = (
  uri: string | undefined,
  fallbackAspectRatio: number = DEFAULT_REMOTE_IMAGE_ASPECT_RATIO,
  enabled = true,
): number => {
  const [aspectRatio, setAspectRatio] = useState(fallbackAspectRatio);

  useEffect(() => {
    if (!enabled || !uri) {
      setAspectRatio(fallbackAspectRatio);
      return;
    }

    setAspectRatio(fallbackAspectRatio);

    let cancelled = false;

    Image.getSize(
      uri,
      (width, height) => {
        if (cancelled || width <= 0 || height <= 0) return;
        setAspectRatio(width / height);
      },
      () => {},
    );

    return () => {
      cancelled = true;
    };
  }, [uri, fallbackAspectRatio, enabled]);

  return aspectRatio;
};
