<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
} from 'chart.js'

// Registrar los módulos de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

// Definir las "props" que recibirá el componente
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

// Opciones básicas del gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div style="height: 300px;">
    <Line :data="props.chartData" :options="chartOptions" />
  </div>
</template>
