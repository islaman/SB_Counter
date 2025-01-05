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

router.delete('/api/sales/:id', async (req, res) => {  // Añadido /api/ al inicio
  try {
    const result = await Sale.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting sale' });
  }
});

// Y la ruta de reset también necesita el prefijo /api/
router.post('/api/sales/reset', async (req, res) => {  // Añadido /api/ al inicio
  try {
    await Sale.deleteMany(); // Borra todas las ventas
    res.status(200).json({ message: 'Todas las ventas han sido eliminadas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al resetear las ventas' });
  }
});

// En tu backend, añade esta nueva ruta
router.delete('/api/sales/company/:company', async (req, res) => {
  try {
    const { company } = req.params;
    await Sale.deleteMany({ company });
    res.status(200).json({ message: `Todas las ventas de ${company} han sido eliminadas` });
  } catch (error) {
    res.status(500).json({ error: `Error al resetear las ventas de ${company}` });
  }
});

module.exports = router;
