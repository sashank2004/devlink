import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export const shortenUrl = (longUrl) => API.post('/api/urls', { longUrl });
export const getStats = (code) => API.get(`/api/urls/${code}/stats`);