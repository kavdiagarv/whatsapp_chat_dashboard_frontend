// src/api/chatApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/chat';

export const getChatMessages = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${sessionId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};
