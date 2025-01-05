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

// Agregar una nueva venta
router.post('/api/sales', async (req, res) => {
  try {
    const { company, sku, amount, type } = req.body;
    if (!company || !sku || !amount || !type) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sale = new Sale({ company, sku, amount, type });
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la venta' });
  }
});

module.exports = router;
