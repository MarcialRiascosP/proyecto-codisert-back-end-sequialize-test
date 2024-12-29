const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Estado = sequelize.define('Estado', {
  idEstado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'estado',
  timestamps: true,
});

module.exports = Estado;