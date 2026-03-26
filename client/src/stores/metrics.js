import { defineStore } from 'pinia';
import { getMetrics } from '../services/api';

export const useMetricsStore = defineStore('metrics', {
  state: () => ({
    allMetrics: [],
    loading: false
  }),
  actions: {
    async fetchMetrics() {
      this.loading = true;
      try {
        this.allMetrics = await getMetrics();
      } catch (error) {
        console.error("Error al traer métricas:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});
