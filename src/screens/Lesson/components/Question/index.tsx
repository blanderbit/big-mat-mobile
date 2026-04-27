import { Text } from '@components/Text';

type Props = {
  text: string;
};

export const SlideQuestion = ({ text }: Props) => (
  <Text center size={20}>
    {text}
  </Text>
);
