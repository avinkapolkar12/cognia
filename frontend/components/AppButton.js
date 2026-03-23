import { Pressable, Text } from 'react-native';
import styles from '../styles/components/AppButtonStyles';

export default function AppButton({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
