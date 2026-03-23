import { TextInput } from 'react-native';
import { Colors } from '../constants/colors';
import styles from '../styles/components/AppInputStyles';

export default function AppInput(props) {
  return <TextInput style={styles.input} placeholderTextColor={Colors.muted} {...props} />;
}
