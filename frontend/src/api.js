import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://devlink-api-wbvx.onrender.com'
});

export const shortenUrl = (longUrl) => API.post('/api/urls', { longUrl });
export const getStats = (code) => API.get(`/api/urls/${code}/stats`);