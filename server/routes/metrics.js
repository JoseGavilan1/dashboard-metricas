const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

// Obtener todas las métricas
router.get('/', async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ date: -1 });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Guardar una nueva métrica
router.post('/', async (req, res) => {
  const metric = new Metric(req.body);
  try {
    const newMetric = await metric.save();
    res.status(201).json(newMetric);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Metric.findByIdAndDelete(req.params.id);
  res.json({ message: 'Eliminado' });
});

module.exports = router;