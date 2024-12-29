const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Configuración de la base de datos

// Definir el modelo Estrato
const Estrato = sequelize.define('Estrato', {
  idEstrato: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Generar un ID único automáticamente
  },
  Estrato: {
    type: DataTypes.STRING,
    allowNull: false, // No puede ser nulo
    unique: true, // Asegurarse de que no se repita el nombre del estrato
    validate: {
      notEmpty: true, // No permitir valores vacíos
    },
  },
}, {
  tableName: 'estrato', // Nombre de la tabla en la base de datos
  timestamps: true, // Si tienes campos como `createdAt` y `updatedAt`
});

module.exports = Estrato;