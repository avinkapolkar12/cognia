import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlerts } from '../context/AlertsContext';

export default function TopAlertBanner() {
  const { bannerAlert, dismissBanner } = useAlerts();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (bannerAlert) {
      translateY.setValue(-24);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 45, friction: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, { toValue: -24, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
  }, [bannerAlert, opacity, translateY]);

  if (!bannerAlert) {
    return null;
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + 12,
        left: 16,
        right: 16,
        zIndex: 999,
        opacity,
        transform: [{ translateY }],
      }}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={dismissBanner}
        style={{
          backgroundColor: '#7F1D1D',
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="notifications" size={18} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '700', fontFamily: 'Inter', marginBottom: 2 }}>
            {bannerAlert.title}
          </Text>
          <Text style={{ color: '#FECACA', fontSize: 13, fontFamily: 'Inter' }}>
            {bannerAlert.severity} alert received
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
