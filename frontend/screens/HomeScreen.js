import { View, Text, ScrollView, Pressable, Animated, Image, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // ✅ Added to trigger fetch on screen focus
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons'; 
import styles from '../styles/screens/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deviceService } from '../services/deviceService';
import { geofenceService } from '../services/geofenceService';

// ---------- Animated Button ----------
const AnimatedActionBtn = ({ title, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.actionBtnContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={styles.actionBtn}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={styles.actionText}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }) {
  const [pstatus, setStatus] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [activeGeofence, setActiveGeofence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade animation happens only once when component mounts
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // ✅ Trigger data fetch EVERY TIME the screen is opened/focused
  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [])
  );

  async function loadAllData() {
    try {
      setIsLoading(true);
      const userString = await AsyncStorage.getItem("user");
      if (!userString) return;
      const user = JSON.parse(userString);
      const userId = user.user_id || user.id || 1;

      // 1. Fetch Live Device Details
      const devices = await deviceService.getUserDevices(userId);
      const mainDevice = devices && devices.length > 0 ? devices[0] : null;
      setDeviceData(mainDevice);

      // 2. Fetch Geofence Details
      if (mainDevice) {
        try {
          const gf = await geofenceService.getGeofence(mainDevice.device_id);
          if (gf && gf.latitude) setActiveGeofence(gf);
        } catch (gfErr) {
          console.log("No geofence found, using defaults");
        }
      }

      setStatus({
        name: user.patient_name,
        condition: user.medical_condition,
        photo: user.profile_photo_url,
        activity: "Active",
        zone: mainDevice?.latitude ? "Safe" : "-", 
        falls: "0",
        battery: mainDevice?.battery_level !== undefined ? `${mainDevice.battery_level}%` : null,
        isBatteryLow: mainDevice?.battery_level < 20,
        connection: mainDevice?.status ? (mainDevice.status.charAt(0).toUpperCase() + mainDevice.status.slice(1)) : "Offline",
        camera: mainDevice?.face_detection ? "Active" : "Disabled"
      });
    } catch (err) {
      console.log("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAllData();
    setIsRefreshing(false);
  };

  // ---------- Open Google Maps Action ----------
  const openDirections = () => {
    const targetLat = deviceData?.latitude || activeGeofence?.latitude || 15.2815;
    const targetLng = deviceData?.longitude || activeGeofence?.longitude || 74.0220;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
    Linking.openURL(url).catch(err => console.error("Couldn't load Google Maps", err));
  };

  // ---------- Advanced Google-Style Map HTML ----------
  const mapHTML = useMemo(() => {
    const gfLat = activeGeofence?.latitude || 15.2815;
    const gfLng = activeGeofence?.longitude || 74.0220;
    const gfRad = activeGeofence?.radius_meters || 60;
    
    const piLat = deviceData?.latitude || gfLat;
    const piLng = deviceData?.longitude || gfLng;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; cursor: pointer; }
          
          .device-marker {
            background-color: #EF4444;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(239,68,68,0.8);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { 
            zoomControl: false, 
            dragging: false, 
            touchZoom: false, 
            doubleClickZoom: false, 
            scrollWheelZoom: false 
          });

          L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            attribution: '© Google'
          }).addTo(map);

          L.circle([${gfLat}, ${gfLng}], {
            radius: ${gfRad},
            color: '#10B981',
            weight: 2,
            dashArray: '5, 5',
            fillColor: '#10B981',
            fillOpacity: 0.2
          }).addTo(map);

          var deviceIcon = L.divIcon({
            className: 'device-marker',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          L.marker([${piLat}, ${piLng}], {icon: deviceIcon}).addTo(map);

          var bounds = L.latLngBounds([
            [${gfLat}, ${gfLng}],
            [${piLat}, ${piLng}]
          ]);
          map.fitBounds(bounds, { padding: [25, 25], maxZoom: 17 });

          map.on('click', function() {
            window.ReactNativeWebView.postMessage('open_maps');
          });
        </script>
      </body>
      </html>
    `;
  }, [deviceData, activeGeofence]);

  if (isLoading || !pstatus) {
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC'}}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#10B981"
        />
      }
    >
      <Pressable
        style={styles.patientCard}
        onPress={() => navigation.navigate('Profile', { user: { ...pstatus, user_id: deviceData?.user_id }, deviceData })}
      >
        {pstatus.photo ? (
          <Image source={{ uri: pstatus.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }]}>
             <Ionicons name="person" size={32} color="#94A3B8" />
          </View>
        )}
        <View style={styles.patientInfoWrap}>
          <Text style={styles.name}>{pstatus.name}</Text>
          <Text style={styles.meta}>{pstatus.condition}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </Pressable>

      <Text style={styles.sectionTitle}>Live Status</Text>

      <View style={styles.statusRow}>
        <View style={styles.statusBox}>
          <Text style={styles.statusValue}>{pstatus.activity || '-'}</Text>
          <Text style={styles.statusLabel}>Activity</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusValue}>{pstatus.zone || '-'}</Text>
          <Text style={styles.statusLabel}>Zone</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusValue}>{pstatus.falls || '0'}</Text>
          <Text style={styles.statusLabel}>Falls</Text>
        </View>
      </View>

      <View style={[styles.statusRow, { marginBottom: 25 }]}>
        <View style={styles.statusBox}>
          <Text style={[styles.statusValue, pstatus.isBatteryLow && { color: '#EF4444' }]}>
            {pstatus.battery || '-%'}
          </Text>
          <Text style={styles.statusLabel}>Pi Battery</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={[styles.statusValue, pstatus.connection === "Offline" && { color: '#94A3B8' }]}>
            {pstatus.connection}
          </Text>
          <Text style={styles.statusLabel}>Network</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusValue}>{pstatus.camera}</Text>
          <Text style={styles.statusLabel}>Camera</Text>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <WebView
          // ✅ Added Geofence variables to the key so the map forces a refresh if you edited the geofence
          key={`${deviceData?.latitude}-${deviceData?.longitude}-${activeGeofence?.latitude}-${activeGeofence?.radius_meters}`} 
          originWhitelist={['*']}
          source={{ html: mapHTML, baseUrl: 'https://unpkg.com' }}
          style={styles.map}
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          onMessage={(event) => {
            if (event.nativeEvent.data === 'open_maps') {
              openDirections();
            }
          }}
        />
        <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 6, pointerEvents: 'none' }}>
          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>Tap map for directions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <AnimatedActionBtn
          title="Known People"
          onPress={() => navigation.navigate('Known')}
        />
        <AnimatedActionBtn
          title="Edit Geofence"
          onPress={() => navigation.navigate('Geofence')}
        />
        <AnimatedActionBtn
          title="View Alerts"
          onPress={() => navigation.navigate('Alerts')}
        />
        <AnimatedActionBtn
          title="Profile Details"
          onPress={() => navigation.navigate('Profile', { user: { ...pstatus, user_id: deviceData?.user_id }, deviceData })}
        />
      </View>
    </Animated.ScrollView>
  );
}