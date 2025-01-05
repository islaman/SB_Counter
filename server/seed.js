const mongoose = require('mongoose');
const Sale = require('./models/Sale'); // Ruta al modelo de ventas
require('dotenv').config();
const connectDB = require('./config/db'); // Archivo de conexión a la base de datos

const seedSales = async () => {
  await connectDB(); // Conecta a la base de datos

  try {
    // Limpia la colección antes de insertar nuevos datos
    await Sale.deleteMany();

    // Datos de prueba
    const salesData = [
      { company: 'EUROFARMA', sku: '2105005', amount: 50, type: 'units' },
      { company: 'GENOMMA', sku: '577199', amount: 20, type: 'units' },
      { company: 'WINKLER', sku: '588538', amount: 1000, type: 'amount' },
      { company: 'SANITAS', sku: '587816', amount: 5, type: 'units' },
    ];

    // Inserta los datos
    await Sale.insertMany(salesData);
    console.log('Datos de prueba insertados correctamente');
    process.exit(); // Cierra el proceso
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    process.exit(1);
  }
};

seedSales();
