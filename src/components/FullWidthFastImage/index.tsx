import { StyleProp, StyleSheet } from 'react-native';
import FastImage, {
  ImageStyle as FastImageStyle,
} from 'react-native-fast-image';

import { useRemoteImageAspectRatio } from '@hooks/useRemoteImageAspectRatio';

type Props = {
  uri: string;
  style?: StyleProp<FastImageStyle>;
};

export const FullWidthFastImage = ({ style, uri }: Props) => {
  const aspectRatio = useRemoteImageAspectRatio(uri);

  if (!uri) return null;

  return (
    <FastImage
      resizeMode="contain"
      source={{ uri }}
      style={[styles.questionImage, { aspectRatio }, style]}
    />
  );
};

const styles = StyleSheet.create({
  questionImage: {
    width: '100%',
  },
});
