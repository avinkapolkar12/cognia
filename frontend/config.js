// config.js
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDefaultApiBaseUrl = () => {
	// Highest priority: explicit environment override.
	if (process.env.EXPO_PUBLIC_API_URL) {
		return process.env.EXPO_PUBLIC_API_URL;
	}

	// In Expo dev, reuse the Metro host so physical-device testing works on LAN.
	const hostUri =
		Constants.expoConfig?.hostUri ||
		Constants.manifest2?.extra?.expoGo?.debuggerHost ||
		'';
	const host = hostUri ? hostUri.split(':')[0] : '';
	if (host) {
		if (Platform.OS === 'android' && (host === '127.0.0.1' || host === 'localhost')) {
			return 'http://10.0.2.2:8000';
		}
		return `http://${host}:8000`;
	}

	// Emulator/local fallback when host cannot be derived.
	if (Platform.OS === 'android') {
		return 'http://10.0.2.2:8000';
	}

	return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getDefaultApiBaseUrl();

// ✅ Your exact Cloudinary URL using your Cloud Name
export const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dt1wxhm0s/image/upload';

// ✅ You just need to create this in your Cloudinary Settings -> Upload -> Add Upload Preset (Set to "Unsigned")
export const UPLOAD_PRESET = 'fqjn4atu';