import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';

type Props = {
  value: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  textSize?: number;
};

export const Input = ({
  active = false,
  disabled = false,
  onPress,
  placeholder = ' ',
  style,
  textSize = 34,
  value,
}: Props) => {
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.inputBox,
        active && !disabled ? styles.inputBoxActive : null,
        style,
      ]}
      onPress={onPress}
    >
      <Text semiBold size={textSize}>
        {value || placeholder}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    height: 60,
    backgroundColor: '#EEEEE2',
    borderWidth: 1,
    borderColor: colors.darkGrey,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputBoxActive: {
    borderColor: colors.black,
    borderWidth: 2,
  },
});

