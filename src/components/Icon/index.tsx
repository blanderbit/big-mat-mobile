import { GestureResponderEvent } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  icon: string;
  color?: string;
  size?: number;
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
};

export const Icon = ({ icon, color, size, onPress }: Props) => (
  <MaterialCommunityIcons
    color={color}
    name={icon}
    size={size}
    onPress={onPress}
  />
);
