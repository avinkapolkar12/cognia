import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/alerts`;

export const alertService = {
  getUserAlerts: async (userId) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data || [];
  },
};
