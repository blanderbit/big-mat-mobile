import { StyleProp, StyleSheet } from 'react-native';
import FastImage, {
  ImageStyle as FastImageStyle,
  ResizeMode,
} from 'react-native-fast-image';

import { useRemoteImageAspectRatio } from '@hooks/useRemoteImageAspectRatio';

type Props = {
  uri: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<FastImageStyle>;
  resizeMode?: ResizeMode;
};

export const SizedFastImage = ({
  uri,
  width: explicitWidth,
  height: explicitHeight,
  borderRadius,
  style,
  resizeMode = FastImage.resizeMode.cover,
}: Props) => {
  const hasFixedSize =
    explicitWidth != null && explicitHeight != null;
  const aspectRatio = useRemoteImageAspectRatio(uri, undefined, !hasFixedSize);

  const radiusStyle =
    borderRadius != null ? { borderRadius, overflow: 'hidden' as const } : null;

  if (!uri) return null;

  if (hasFixedSize) {
    return (
      <FastImage
        resizeMode={resizeMode}
        source={{ uri }}
        style={[
          { width: explicitWidth, height: explicitHeight },
          radiusStyle,
          style,
        ]}
      />
    );
  }

  if (explicitWidth != null) {
    return (
      <FastImage
        resizeMode={resizeMode}
        source={{ uri }}
        style={[
          {
            width: explicitWidth,
            height: Math.round(explicitWidth / aspectRatio),
          },
          radiusStyle,
          style,
        ]}
      />
    );
  }

  if (explicitHeight != null) {
    return (
      <FastImage
        resizeMode={resizeMode}
        source={{ uri }}
        style={[
          {
            width: Math.round(explicitHeight * aspectRatio),
            height: explicitHeight,
          },
          radiusStyle,
          style,
        ]}
      />
    );
  }

  return (
    <FastImage
      resizeMode={resizeMode}
      source={{ uri }}
      style={[
        styles.fullWidth,
        { aspectRatio },
        radiusStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});
