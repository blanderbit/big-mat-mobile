import { useEffect, useState } from 'react';
import { Image, StyleProp, StyleSheet } from 'react-native';
import FastImage, {
  ImageStyle as FastImageStyle,
  ResizeMode,
} from 'react-native-fast-image';

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
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (explicitWidth != null && explicitHeight != null) return;
    Image.getSize(
      uri,
      (iw, ih) => {
        if (iw > 0 && ih > 0) setNaturalAspectRatio(iw / ih);
      },
      () => {},
    );
  }, [uri, explicitWidth, explicitHeight]);

  const radiusStyle =
    borderRadius != null ? { borderRadius, overflow: 'hidden' as const } : null;

  if (explicitWidth != null && explicitHeight != null) {
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

  if (explicitWidth != null && naturalAspectRatio != null) {
    return (
      <FastImage
        resizeMode={resizeMode}
        source={{ uri }}
        style={[
          {
            width: explicitWidth,
            height: Math.round(explicitWidth / naturalAspectRatio),
          },
          radiusStyle,
          style,
        ]}
      />
    );
  }

  if (explicitHeight != null && naturalAspectRatio != null) {
    return (
      <FastImage
        resizeMode={resizeMode}
        source={{ uri }}
        style={[
          {
            width: Math.round(explicitHeight * naturalAspectRatio),
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
        naturalAspectRatio != null ? { aspectRatio: naturalAspectRatio } : null,
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
