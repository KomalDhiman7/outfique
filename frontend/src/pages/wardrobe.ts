import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Change if hosted

export const getWardrobe = async (userId: string) => {
  const res = await axios.get(`${API_BASE}/wardrobe`, { params: { user_id: userId } });
  return res.data;
};

export const addOutfit = async (outfit: {
  user_id: string;
  name: string;
  category: string;
  color: string;
  image_url: string;
}) => {
  return axios.post(`${API_BASE}/wardrobe`, outfit);
};

export const deleteOutfit = async (id: number) => {
  return axios.delete(`${API_BASE}/wardrobe/${id}`);
};
