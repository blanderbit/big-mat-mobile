import { Text } from '@components/Text';

import { getUkrLetterByIndex } from '@extra/getUkrLetterByIndex';

type Props = {
  index: number;
};

export const AnswerVariant = ({ index }: Props) => {
  return <Text bold>{getUkrLetterByIndex(index)})</Text>;
};
