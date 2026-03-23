import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // ✅ Added to handle navigation
import { Ionicons } from '@expo/vector-icons'; // ✅ Added for the bell icon
import styles from '../styles/screens/AppBarStyles';
import { useAlerts } from '../context/AlertsContext';

export default function AppBar({ title, subtitle, topOffset = 12 }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { hasUnread } = useAlerts();

  return (
    <View style={[styles.container, { paddingTop: insets.top + topOffset }]}>
      {/* Group title and subtitle together */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* The Bell Icon */}
      <Pressable 
        onPress={() => navigation.navigate('Alerts')} 
        style={styles.iconBtn}
      >
        <Ionicons name="notifications-outline" size={24} color="#333" />
        {hasUnread ? <View style={styles.notificationDot} /> : null}
      </Pressable>
    </View>
  );
}