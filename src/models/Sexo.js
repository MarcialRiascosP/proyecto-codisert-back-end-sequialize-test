const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sexo = sequelize.define('Sexo', {
  idSexo: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  Sexo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'sexo', // Asegúrate de que coincida con el nombre de la tabla en la base de datos
  timestamps: true,  // Para que Sequelize maneje los campos createdAt y updatedAt
});

module.exports = Sexo;