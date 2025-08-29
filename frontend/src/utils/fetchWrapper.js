import axios from "axios";

const API_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, method = "GET", data = null, token = null) => {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (data) {
    config.data = data;
  }

  try {
    const res = await axios(config);
    return res.data;
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
};
