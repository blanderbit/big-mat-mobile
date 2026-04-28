import { Dimensions, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { Text } from '@components/Text';

import { colors } from '@extra/colors';
import { DEFAULT_SPACE } from '@extra/constants';

type Props = {
  isCorrect: boolean;
  text: string;
  onPressNext: () => void;
  disabled?: boolean;
};

export const AnswerResult = ({
  isCorrect,
  text,
  onPressNext,
  disabled,
}: Props) => {
  const windowWidth = Dimensions.get('window').width;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isCorrect ? colors.green : colors.brightOrange,
          width: windowWidth,
          paddingBottom: bottom + DEFAULT_SPACE,
        },
      ]}
    >
      <Text center semiBold color={colors.white} size={20}>
        {text}
      </Text>

      <Button
        disabled={disabled}
        title={isCorrect ? t('next') : t('continue')}
        onPress={onPressNext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: DEFAULT_SPACE,
    paddingTop: DEFAULT_SPACE * 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
    gap: DEFAULT_SPACE,
  },
});
