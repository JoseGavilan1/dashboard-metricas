import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};
