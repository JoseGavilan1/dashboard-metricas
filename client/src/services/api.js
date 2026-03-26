import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dashboard-metricas-jgavilan.vercel.app/api'
});

export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};
