import { useEffect, useState } from 'react';
import { Image, StyleProp, StyleSheet } from 'react-native';
import FastImage, { ImageStyle as FastImageStyle } from 'react-native-fast-image';

type Props = {
  uri: string;
  style?: StyleProp<FastImageStyle>;
};

export const FullWidthFastImage = ({ style, uri }: Props) => {
  const [questionImageMeta, setQuestionImageMeta] = useState<{
    url: string;
    aspectRatio: number;
  } | null>(null);

  const questionImageAspectRatio =
    uri && questionImageMeta?.url === uri
      ? questionImageMeta.aspectRatio
      : undefined;

  useEffect(() => {
    if (!uri) return;

    Image.getSize(
      uri,
      (width: number, height: number) => {
        if (width > 0 && height > 0) {
          setQuestionImageMeta({
            url: uri,
            aspectRatio: width / height,
          });
        }
      },
      () => {
        // ignore
      },
    );
  }, [uri]);

  return (
    <FastImage
      resizeMode="contain"
      source={{ uri }}
      style={[
        styles.questionImage,
        questionImageAspectRatio != null
          ? { aspectRatio: questionImageAspectRatio }
          : null,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  questionImage: {
    width: '100%',
  },
});
