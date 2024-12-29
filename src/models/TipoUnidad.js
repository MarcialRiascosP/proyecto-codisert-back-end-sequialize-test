const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoUnidad = sequelize.define('TipoUnidad', {
  idTipoUnidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TipoUnidad: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'tipounidad',  
  timestamps: true,  
});

module.exports = TipoUnidad;