import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/devices`;

export const deviceService = {
  
  registerDevice: async (deviceId, userId) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, {
        device_id: deviceId,
        user_id: parseInt(userId) // Ensure userId is an integer for the FK
      });
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  },

  getDevice: async (deviceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch device failed:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserDevices: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data; // This returns the array of devices for the dashboard
    } catch (error) {
      console.error("Fetch user devices failed:", error.response?.data || error.message);
      throw error;
    }
  },

  updateDevice: async (deviceId, updates) => {
    try {
      // ✅ This handles everything: Location, Detection Toggles, and Battery
      const response = await axios.patch(`${BASE_URL}/${deviceId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ New Helper: Specifically for the Raspberry Pi Heartbeat
  sendHeartbeat: async (deviceId, lat, lng, battery) => {
    try {
      return await axios.patch(`${BASE_URL}/${deviceId}`, {
        latitude: lat,
        longitude: lng,
        battery_level: battery,
        status: 'online',
        is_active: true
      });
    } catch (error) {
      console.error("Heartbeat failed:", error.message);
    }
  }
};