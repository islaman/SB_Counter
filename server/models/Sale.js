const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  company: { type: String },
  sku: { type: String},
  amount: { type: Number},
  type: { type: String},
  timestamp: { type: Date, default: Date.now } // Valor por defecto

});

module.exports = mongoose.model('Sale', saleSchema);
