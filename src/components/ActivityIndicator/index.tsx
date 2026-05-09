import { ActivityIndicator as RNActivityIndicator } from 'react-native';

import { colors } from '@extra/colors';

type Props = {
  size?: 'small' | 'large';
  color?: string;
};

export const ActivityIndicator = ({
  color = colors.white,
  size = 'large',
}: Props) => {
  return <RNActivityIndicator color={color} size={size} />;
};
