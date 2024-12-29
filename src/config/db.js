require('dotenv').config();  // Cargar las variables de entorno

const { Sequelize } = require('sequelize');

// Crear la instancia de Sequelize utilizando las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '-05:00', // Configura la zona horaria a UTC-5
    dialectOptions: {
      timezone: '-05:00', // Asegura que Sequelize envíe la zona horaria correcta al servidor
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;

