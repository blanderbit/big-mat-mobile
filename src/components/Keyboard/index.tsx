import { Platform, StyleSheet, View } from 'react-native';

import { Pressable } from '@components/Pressable';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

import BackArrow2 from '@assets/images/backArrow2.svg';

type Props = {
  disabled?: boolean;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
};

type Key =
  | { type: 'digit'; value: string }
  | { type: 'empty' }
  | { type: 'backspace' };

const KEYS: Key[] = [
  { type: 'digit', value: '1' },
  { type: 'digit', value: '2' },
  { type: 'digit', value: '3' },
  { type: 'digit', value: '4' },
  { type: 'digit', value: '5' },
  { type: 'digit', value: '6' },
  { type: 'digit', value: '7' },
  { type: 'digit', value: '8' },
  { type: 'digit', value: '9' },
  { type: 'empty' },
  { type: 'digit', value: '0' },
  { type: 'backspace' },
];

export const Keyboard = ({ disabled = false, onBackspace, onDigit }: Props) => {
  return (
    <View style={styles.keyboard}>
      {KEYS.map((el, index) => {
        const isDisabledKey = el.type === 'empty' || el.type === 'backspace';

        return (
          <Pressable
            key={index}
            style={[
              styles.key,
              isDisabledKey ? styles.keyDisabled : styles.keyEnabled,
            ]}
            onPress={
              disabled
                ? undefined
                : () => {
                    if (el.type === 'digit') {
                      onDigit(el.value);
                      return;
                    }

                    if (el.type === 'backspace') {
                      onBackspace();
                    }
                  }
            }
          >
            {el.type === 'digit' ? (
              <Text semiBold size={34} style={styles.keyText}>
                {el.value}
              </Text>
            ) : el.type === 'backspace' ? (
              <View style={styles.backspaceIconWrap}>
                <BackArrow2 />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  backspaceIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 2,
  },
  key: {
    width: '30%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  keyEnabled: {
    backgroundColor: colors.brightBeige,
    borderWidth: 1,
    borderColor: colors.darkGrey,
  },
  keyText: {
    ...(Platform.OS === 'android'
      ? {
          includeFontPadding: false,
          lineHeight: 34,
          textAlignVertical: 'center',
        }
      : null),
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DEFAULT_SPACE,
    justifyContent: 'space-between',
  },
});
