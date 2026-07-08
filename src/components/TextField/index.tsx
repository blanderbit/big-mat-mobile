import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { Text } from '@components/Text';

import { colors } from '@extra/colors';

type Props = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TextField = ({
  label,
  containerStyle,
  style,
  placeholderTextColor = colors.darkGrey,
  ...rest
}: Props) => {
  return (
    <View style={containerStyle}>
      {label ? (
        <Text marginBottom={8} semiBold size={14}>
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 56,
    backgroundColor: '#EEEEE2',
    borderWidth: 1,
    borderColor: colors.darkGrey,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.black,
  },
});
