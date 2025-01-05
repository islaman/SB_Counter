const mongoose = require('mongoose');
require('dotenv').config(); // Asegúrate de que esto esté presente

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
    console.log('URI de conexión:', process.env.MONGO_URI);

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Termina el proceso si no se puede conectar
  }
};

module.exports = connectDB;
