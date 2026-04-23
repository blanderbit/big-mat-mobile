import { StyleSheet, View } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message/lib/src/types';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

type Props = {
  title?: string;
  color: string;
};

const Stick = ({ color, title }: Props) => (
  <View style={[styles.toast, { backgroundColor: color }]}>
    {title && <Text color={colors.white}>{title}</Text>}
  </View>
);

export const config = {
  success: ({ text1 }: BaseToastProps) => (
    <Stick color={colors.green} title={text1} />
  ),
  error: ({ text1 }: BaseToastProps) => (
    <Stick color={colors.brightOrange} title={text1} />
  ),
  info: ({ text1 }: BaseToastProps) => (
    <Stick color={colors.brightYellow} title={text1} />
  ),
};

const styles = StyleSheet.create({
  toast: {
    borderRadius: 8,
    padding: 4,
    marginHorizontal: DEFAULT_SPACE,
  },
});
