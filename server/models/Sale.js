// server/models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  company: String, // Nombre de la empresa
  sku: String, // Código del producto
  amount: Number, // Cantidad o monto
  type: { type: String, enum: ['units', 'amount'], required: true }, // Tipo: 'units' o 'amount'
  timestamp: { type: Date, default: Date.now }, // Fecha de la venta
});

module.exports = mongoose.model('Sale', saleSchema);
