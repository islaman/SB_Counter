const mongoose = require('mongoose');
require('dotenv').config(); // Si usas un archivo .env para las credenciales

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
    console.log('Base de datos vaciada exitosamente');
    process.exit(); // Termina el proceso
  } catch (error) {
    console.error('Error al vaciar la base de datos:', error);
    process.exit(1); // Termina el proceso con error
  }
};

clearDatabase();
