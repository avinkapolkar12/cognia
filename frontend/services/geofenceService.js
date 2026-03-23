import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/geofence`;
export const geofenceService = {
  setGeofence: async (deviceId, lat, lng, radius) => {
    try {
      const response = await axios.post(`${BASE_URL}/set`, {
        device_id: deviceId,
        latitude: lat,
        longitude: lng,
        radius_meters: radius
      });
      console.log("Geofence Sync Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Geofence Sync Failed:", error.response?.data || error.message);
      throw error;
    }
  },
  getGeofence: async (deviceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${deviceId}`);
      return response.data; 
    } catch (error) {
      console.error("Fetch geofence failed:", error.message);
      return null;
    }
  }
};
