const express = require('express');
const mongoose = require('mongoose');
const salesRouter = require('./sb_counter/routes/sales'); // Importa las rutas

const app = express();
app.use(express.json());
app.use(salesRouter); // Usa las rutas de ventas

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
