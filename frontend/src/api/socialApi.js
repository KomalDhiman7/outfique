import axios from "axios";
const API_URL = "http://localhost:5000";

// Like/unlike post
export const likePost = async (postId, token) => {
  return axios.post(`${API_URL}/like/${postId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Save/unsave post
export const savePost = async (postId, token) => {
  return axios.post(`${API_URL}/save/${postId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Comment on post
export const commentPost = async (postId, text, token) => {
  return axios.post(`${API_URL}/comment/${postId}`, { text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Follow/unfollow user
export const followUser = async (targetId, token) => {
  return axios.post(`${API_URL}/follow/${targetId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
