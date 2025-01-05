const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  company: { type: String, required: true },
  sku: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model('Sale', saleSchema);
