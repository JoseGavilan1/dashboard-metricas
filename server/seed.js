require('dotenv').config();
const mongoose = require('mongoose');
const Metric = require('./models/Metric');

const seedData = [
  { platform: 'Instagram', followers: 1200, posts: 30, reach: 8000, date: new Date('2026-03-01') },
  { platform: 'Instagram', followers: 1350, posts: 35, reach: 9500, date: new Date('2026-03-10') },
  { platform: 'Instagram', followers: 1500, posts: 45, reach: 12000, date: new Date('2026-03-24') },
  { platform: 'TikTok', followers: 5000, posts: 10, reach: 50000, date: new Date('2026-03-05') },
  { platform: 'TikTok', followers: 7200, posts: 15, reach: 85000, date: new Date('2026-03-15') },
  { platform: 'TikTok', followers: 9800, posts: 22, reach: 150000, date: new Date('2026-03-24') }
];

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    console.log('🌱 Sembrando datos...');
    await Metric.deleteMany({}); 
    await Metric.insertMany(seedData);
    console.log('✅ ¡Datos de prueba insertados!');
    process.exit();
  })
  .catch(err => console.log(err));