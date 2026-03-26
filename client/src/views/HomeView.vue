<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import LineChart from '../components/LineChart.vue';

const metrics = ref([]);

const selectedPlatform = ref('Instagram');

const isModalOpen = ref(false);

const openModal = () => isModalOpen.value = true;
const closeModal = () => isModalOpen.value = false;

// Modificamos la función de guardar para que también cierre el modal
const saveMetric = async () => {
  try {
    await axios.post('https://dashboard-metricas-jgavilan.vercel.app/api/metrics', newMetric.value);
    fetchMetrics();
    closeModal(); // <--- Cerramos el modal automáticamente
    // Resetear el formulario para la próxima vez
    newMetric.value = { platform: 'Instagram', followers: 0, reach: 0, date: new Date().toISOString().split('T')[0] };
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};

const totalFollowers = computed(() => {
  const filtered = metrics.value.filter(m => m.platform === selectedPlatform.value);
  if (filtered.length === 0) return 0;
  const latest = filtered.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return latest.followers;
});

// Cálculo del promedio de alcance (Reach)
const averageReach = computed(() => {
  const filtered = metrics.value.filter(m => m.platform === selectedPlatform.value);
  if (filtered.length === 0) return 0;
  const sum = filtered.reduce((acc, curr) => acc + curr.reach, 0);
  return Math.round(sum / filtered.length);
});

const fetchMetrics = async () => {
  try {
    const response = await axios.get('https://dashboard-metricas-jgavilan.vercel.app/api/metrics');
    metrics.value = response.data;
  } catch (error) {
    console.error("Error al traer datos:", error);
  }
};

// Gráfico dinámico según la plataforma seleccionada
const chartData = computed(() => {
  const filteredData = metrics.value
    .filter(m => m.platform === selectedPlatform.value)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    labels: filteredData.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: `Seguidores en ${selectedPlatform.value}`,
        backgroundColor: selectedPlatform.value === 'Instagram' ? '#E1306C' : '#000000',
        borderColor: selectedPlatform.value === 'Instagram' ? '#E1306C' : '#000000',
        data: filteredData.map(m => m.followers),
        tension: 0.3 // Esto hace que la línea sea curva y se vea más "pro"
      }
    ]
  };
});

const newMetric = ref({
  platform: 'Instagram',
  followers: 0,
  reach: 0,
  date: new Date().toISOString().split('T')[0]
});

const deleteMetric = async (id) => {
  if (confirm('¿Seguro que quieres borrar este registro?')) {
    await axios.delete(`https://dashboard-metricas-jgavilan.vercel.app/api/metrics/${id}`);
    fetchMetrics(); // Refresca los datos y el gráfico
  }
};

onMounted(fetchMetrics);
</script>

<template>
  <main class="container">
    <h1>📊 Dashboard de Métricas</h1>

    <div class="controls">
      <label>Ver estadísticas de: </label>
      <select v-model="selectedPlatform">
        <option value="Instagram">Instagram</option>
        <option value="TikTok">TikTok</option>
      </select>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span>Total Followers</span>
        <h2>{{ totalFollowers.toLocaleString() }}</h2>
      </div>
      <div class="kpi-card">
        <span>Avg. Reach</span>
        <h2>{{ averageReach.toLocaleString() }}</h2>
      </div>
      <div class="kpi-card">
        <span>Plataforma</span>
        <h2>{{ selectedPlatform }}</h2>
      </div>
    </div>

    <div class="grid">
  <div v-for="item in metrics" :key="item._id" class="card">
    <button @click="deleteMetric(item._id)" class="delete-btn">&times;</button>

    <h3>{{ item.platform }}</h3>
    <p>Followers: <strong>{{ item.followers }}</strong></p>
    <p>Alcance: {{ item.reach }}</p>
    <small>{{ new Date(item.date).toLocaleDateString() }}</small>
  </div>
</div>

    <div class="chart-container" v-if="metrics.length > 0">
      <LineChart :chart-data="chartData" />
    </div>

    <button class="fab" @click="openModal">＋</button>

<div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Registrar Nueva Métrica</h3>
      <button @click="closeModal" class="close-btn">&times;</button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label>Plataforma</label>
        <select v-model="newMetric.platform">
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
        </select>
      </div>
      <div class="form-group">
        <label>Seguidores</label>
        <input type="number" v-model="newMetric.followers">
      </div>
      <div class="form-group">
        <label>Alcance (Reach)</label>
        <input type="number" v-model="newMetric.reach">
      </div>
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" v-model="newMetric.date">
      </div>
      <button class="save-btn" @click="saveMetric">Guardar Registro</button>
    </div>
  </div>
</div>

    </main>


</template>

<style scoped>

/* Contenedor de tarjetas */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

/* Estilo de la tarjeta individual */
.card {
  position: relative;
  background: #1e1e1e; /* Color oscuro igual a tus KPIs */
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #333;
  transition: transform 0.2s, border-color 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  border-color: #42b883; /* Resalta en verde al pasar el mouse */
}

/* El botón de eliminar */
.delete-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: #555;
  font-size: 22px;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff4d4d;
}

/* Badges para diferenciar plataformas */
.badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
}
.badge.instagram { background: #e1306c22; color: #e1306c; }
.badge.tiktok { background: #000000; color: #fff; border: 1px solid #444; }

.card-body p { margin: 5px 0; color: #ccc; }
.card-footer { margin-top: 15px; border-top: 1px solid #333; pt: 10px; color: #666; }

/* Botón Flotante (FAB) */
.fab {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #42b883;
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(66, 184, 131, 0.5);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fab:hover {
  transform: scale(1.1) rotate(90deg); /* Se agranda y gira un poco al pasar el mouse */
}

/* Overlay (Fondo oscuro) */
/* Este es el fondo oscuro que cubre toda la pantalla */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* Más oscuro para que resalte el modal */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Un número alto para que esté por encima de todo */
  backdrop-filter: blur(8px); /* Ese efecto de vidrio esmerilado */
}

/* Esta es la tarjeta blanca (o gris oscuro) central */
.modal-content {
  background: #252525; /* Un gris un poco más claro que el fondo del dashboard */
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  border: 1px solid #444;
}

/* Estilo para los grupos de inputs */
.form-group {
  margin-bottom: 20px;
  text-align: left; /* Para que las etiquetas se alineen bien */
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #42b883; /* Verde para que combine */
  font-weight: bold;
}

input, select {
  width: 100%; /* Que ocupen todo el ancho del modal */
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  color: white;
  border-radius: 10px;
  box-sizing: border-box; /* Importante para que el padding no rompa el ancho */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}


.form-group label { margin-bottom: 5px; color: #aaa; font-size: 0.9rem; }



.save-btn {
  width: 100%;
  padding: 12px;
  background: #42b883;
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
}

.controls {
  margin-bottom: 20px;
  padding: 10px;
  background: #eee;
  border-radius: 8px;
}
select {
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.container { padding: 20px; max-width: 1000px; margin: 0 auto; }
.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.card { border: 1px solid #eee; padding: 15px; border-radius: 8px; background: #fff; }


.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}
.kpi-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
}
.kpi-card span { color: #888; font-size: 0.9rem; text-transform: uppercase; }

.form-section {
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  margin-top: 40px;
  border: 1px dashed #ccc;
}
.form-inline { display: flex; gap: 10px; flex-wrap: wrap; }
input, select, button {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
button { background: #42b883; color: white; cursor: pointer; border: none; font-weight: bold; }
</style>
