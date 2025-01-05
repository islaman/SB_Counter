const express = require('express');
const Sale = require('../models/Sale'); // Asegúrate de que la ruta al modelo es correcta
const router = express.Router();

// Obtener todas las ventas
router.get('/api/sales', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const sales = await Sale.find(filter);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});
router.post('/api/sales', async (req, res) => {
  const { company, sku, amount } = req.body;
  try {
    const sale = new Sale({
      company,
      sku,
      amount,
      type: req.body.type || 'units',
      timestamp: req.body.timestamp || new Date().toISOString(),
    });

    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la venta' });
  }
});


module.exports = router;
