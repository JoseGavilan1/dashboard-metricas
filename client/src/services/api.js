import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dashboard-metricas-jgavilan.vercel.app/api'
});

export const getMetrics = async () => {
  const response = await axios.get('https://dashboard-metricas-bn7f.vercel.app/api/metrics');
  return response.data;
};
