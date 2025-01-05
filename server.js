const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Modelo de datos
const SaleSchema = new mongoose.Schema({
  company: String,
  product: String,
  amount: Number,
  timestamp: Date,
});

const Sale = mongoose.model('Sale', SaleSchema);

// Rutas
app.post('/sales', async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).send(sale);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/sales', async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).send(sales);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
