import { View, Text, ScrollView, Animated, Pressable, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/screens/AlertsScreenStyles';
import AppBar from '../components/AppBar';
import { useAlerts } from '../context/AlertsContext';

const ALERT_ICONS = {
  geofence_breach: 'exit-outline',
  fall_risk: 'warning-outline',
  missed_medication: 'medical-outline',
  device_offline: 'cloud-offline-outline',
};

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return 'Just now';
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return 'Just now';
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 60000));

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

// ✅ Animated Tactile Card for each Alert
const AnimatedAlertCard = ({ alert, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true }).start();
    Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, delay: index * 100, useNativeDriver: true }).start();
  }, []);

  const isCritical = alert.severity === 'Critical';
  const iconName = ALERT_ICONS[alert.alert_type] || 'notifications-outline';

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
      <Pressable
        style={styles.card}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      >
        {/* Dynamic Icon based on Severity */}
        <View style={[styles.iconContainer, isCritical ? styles.iconCriticalBg : styles.iconModerateBg]}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color={isCritical ? '#EF4444' : '#F59E0B'} 
          />
        </View>

        {/* Alert Info */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{alert.title}</Text>
          <View style={styles.timeWrapper}>
            <Ionicons name="time-outline" size={12} color="#94A3B8" />
            <Text style={styles.time}>{formatRelativeTime(alert.created_at)}</Text>
          </View>
        </View>

        {/* Severity Badge */}
        <View style={[styles.badge, isCritical ? styles.badgeCritical : styles.badgeModerate]}>
          <Text style={[styles.badgeText, isCritical ? styles.badgeTextCritical : styles.badgeTextModerate]}>
            {alert.severity}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function AlertsScreen() {
  const { alerts, isLoadingAlerts, refreshAlerts } = useAlerts();

  useFocusEffect(
    useCallback(() => {
      refreshAlerts({ markSeen: true, suppressBanner: true });
    }, [refreshAlerts])
  );

  return (
    <View style={styles.container}>
      {/* ✅ AppBar stays pinned at the top */}
      <AppBar title="System Alerts" subtitle="Recent Cognia notifications" />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingAlerts ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.stateText}>Loading alerts...</Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.centerState}>
            <Ionicons name="notifications-off-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No alerts yet</Text>
            <Text style={styles.stateText}>When the device sends alerts, they will appear here automatically.</Text>
          </View>
        ) : (
          alerts.map((alert, index) => (
            <AnimatedAlertCard key={alert.id || index} alert={alert} index={index} />
          ))
        )}
      </ScrollView>
    </View>
  );
}