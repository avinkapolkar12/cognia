import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/routines`;

export const routineService = {
  saveReminder: async (deviceId, userId, stepData) => {
    const response = await axios.post(`${BASE_URL}/save`, {
      device_id: deviceId,
      user_id: parseInt(userId),
      reminder: {
        title: stepData.title,
        description: stepData.description,
        time: stepData.time
      }
    });
    return response.data;
  },

  getUserRoutines: async (userId) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data; 
  },

  updateReminder: async (userId, index, stepData) => {
    const response = await axios.put(`${BASE_URL}/user/${userId}/reminder/${index}`, {
      title: stepData.title,
      description: stepData.description,
      time: stepData.time
    });
    return response.data;
  },

  deleteReminder: async (userId, index) => {
    const response = await axios.delete(`${BASE_URL}/user/${userId}/reminder/${index}`);
    return response.data;
  }
};