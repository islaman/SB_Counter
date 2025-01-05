const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const salesRoutes = require('./routes/sales'); // Ruta a tu archivo de rutas

const app = express();

// Conexión a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use(salesRoutes);

// Iniciar servidoroiii
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});