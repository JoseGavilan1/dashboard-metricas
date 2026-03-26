require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const metricRoutes = require('./routes/metrics'); // Importar rutas

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB (con el ajuste para evitar timeouts)
// En tu index.js, cambia la conexión a esto:
// En server/index.js
const connectDB = async () => {
  try {
    // Forzamos opciones que ayudan a Node 24 a no perderse
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Obliga a usar IPv4 (esto es VITAL)
      serverSelectionTimeoutMS: 10000, // Le damos 10 segundos para buscar
    });
    console.log('📊 ¡Conectado a MongoDB con Node 24!');
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    console.log('Intentando otra ruta...');
    
    // Si falla el de arriba, intentamos sin el parámetro family (a veces el driver ya lo soluciona)
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📊 Conectado (intento 2)');
    } catch (finalErr) {
        console.error('Falla total de red. Revisa tu Firewall o DNS.');
    }
  }
};

connectDB();

app.use(cors({
  origin: ['https://dashboard-metricas-front-jgavilan.vercel.app', 'http://localhost:5173']
}));

// Usar las rutas
app.use('/api/metrics', metricRoutes);

app.get('/', (req, res) => {
  res.send('🚀 API de Métricas funcionando en Producción');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));