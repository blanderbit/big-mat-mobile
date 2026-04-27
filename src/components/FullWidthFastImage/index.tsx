import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  uri: string;
};

export const FullWidthFastImage = ({ uri }: Props) => {
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
      ]}
    />
  );
};

const styles = StyleSheet.create({
  questionImage: {
    width: '100%',
  },
});
