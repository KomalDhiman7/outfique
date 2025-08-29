import axios from "axios";
const API_URL = "http://localhost:5000";

// Get notifications
export const fetchNotifications = async (token) => {
  return axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Mark notification as read
export const markAsRead = async (notifId, token) => {
  return axios.post(`${API_URL}/notifications/read/${notifId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
