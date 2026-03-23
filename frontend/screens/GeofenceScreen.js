import { View, Text, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useEffect, useRef, useMemo } from 'react';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import styles from '../styles/screens/GeofenceScreenStyles';
import { geofenceService } from '../services/geofenceService';

export default function GeofenceScreen() {
  const webviewRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);           
  const [radius, setRadius] = useState("30");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setIsLoading(true);
    let fallbackLocation = { latitude: 15.2815, longitude: 74.0220 }; // Goa Default

    // 1. Get current phone location (Fallback if DB is empty)
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        const loc = await Location.getCurrentPositionAsync({});
        fallbackLocation = loc.coords;
      } catch (err) {
        console.log("Could not fetch GPS, using default.");
      }
    }

    // 2. Fetch existing Geofence from Database
    try {
      const savedGf = await geofenceService.getGeofence("pi_001"); // Hardcoded for demo
      
      if (savedGf && savedGf.latitude) {
        // Use Database Data
        setMapCenter({ latitude: savedGf.latitude, longitude: savedGf.longitude });
        setInitialRegion({ latitude: savedGf.latitude, longitude: savedGf.longitude });
        if (savedGf.radius_meters) setRadius(String(savedGf.radius_meters));
      } else {
        // Use Current Location
        setMapCenter(fallbackLocation);
        setInitialRegion(fallbackLocation);
      }
    } catch (error) {
      console.log("No geofence found in DB, using current location.");
      setMapCenter(fallbackLocation);
      setInitialRegion(fallbackLocation);
    }
    
    setIsLoading(false);
  }

  // ✅ Save Function
  const saveGeofence = async () => {
    if (!mapCenter) return;
    setIsSaving(true);
    try {
      await geofenceService.setGeofence(
        "pi_001", 
        mapCenter.latitude, 
        mapCenter.longitude, 
        Number(radius)
      );
      Alert.alert("Success", "Safe zone synchronized with the patient's device.");
    } catch (error) {
      Alert.alert("Sync Error", "Failed to update geofence on the server.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (webviewRef.current && radius) {
      const clampedRadius = Math.min(100, Math.max(1, Number(radius) || 1));
      webviewRef.current.injectJavaScript(`
        if (typeof updateMap !== 'undefined') { updateMap(null, null, ${clampedRadius}); }
        true;
      `);
    }
  }, [radius]);

  const onMapMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.lat && data.lng) setMapCenter({ latitude: data.lat, longitude: data.lng });
    } catch (e) { console.error("Map parsing error", e); }
  };

  const numericRadius = Number(radius) || 30;

  // ---------- Map HTML (Google Maps Look, No Pi Marker) ----------
  const leafletHTML = useMemo(() => {
    if (!initialRegion) return '';
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body { height: 100%; width: 100%; margin: 0; padding: 0; background-color: #F8FAFC; }
          #map { height: 100vh; width: 100vw; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {zoomControl: false}).setView([${initialRegion.latitude}, ${initialRegion.longitude}], 18);
          
          // Google Maps Street View Tiles
          L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20
          }).addTo(map);

          var centerMarker = L.marker([${initialRegion.latitude}, ${initialRegion.longitude}], { draggable: true }).addTo(map);
          var circle = L.circle([${initialRegion.latitude}, ${initialRegion.longitude}], {
            radius: ${radius}, color: '#10B981', fillColor: '#10B981', fillOpacity: 0.25, weight: 2, dashArray: '5,5'
          }).addTo(map);

          centerMarker.on('drag', function(e) { circle.setLatLng(centerMarker.getLatLng()); });
          centerMarker.on('dragend', function(e) {
            var pos = centerMarker.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat, lng: pos.lng }));
          });

          window.updateMap = function(lat, lng, rad) {
            if(lat && lng) { var nc = [lat, lng]; centerMarker.setLatLng(nc); circle.setLatLng(nc); }
            if(rad) { circle.setRadius(rad); }
          };
        </script>
      </body>
      </html>
    `;
  }, [initialRegion]); 

  if (isLoading || !initialRegion) {
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC'}}>
         <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const isValidRadius = Number(radius) >= 1 && Number(radius) <= 100;

  return (
    <View style={styles.container}>
      
      {/* Configuration Helper Banner */}
      <View style={[styles.statusBanner, { backgroundColor: '#3B82F6' }]}>
        <Ionicons name="information-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.statusText}>Drag the marker to set the safe zone center.</Text>
      </View>

      <View style={styles.mapContainer}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: leafletHTML }}
          style={styles.map}
          onMessage={onMapMessage}
          javaScriptEnabled={true}
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.handleBar} />
        <Text style={styles.title}>Safe Zone Configuration</Text>
        <Text style={styles.helper}>Adjust the maximum allowed distance.</Text>

        <View style={styles.radiusHeader}>
          <Text style={styles.valueLabel}>Radius Size</Text>
          <TextInput
            style={styles.radiusInput}
            keyboardType="numeric"
            value={radius}
            onChangeText={(val) => {
               let parsed = val.replace(/[^0-9]/g, '');
               if(Number(parsed) > 100) parsed = "100";
               setRadius(parsed);
            }}
          />
          <Text style={styles.unitText}>meters</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          value={numericRadius}
          onValueChange={(val) => setRadius(String(Math.round(val)))}
          minimumTrackTintColor="#10B981"
          maximumTrackTintColor="#E2E8F0"
          thumbTintColor="#10B981"
        />

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            (!isValidRadius || isSaving) && styles.buttonDisabled,
            pressed && isValidRadius && { transform: [{ scale: 0.98 }] }
          ]} 
          onPress={saveGeofence}
          disabled={!isValidRadius || isSaving}
        >
          {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Save Geofence</Text>}
        </Pressable>
      </View>
    </View>
  );
}