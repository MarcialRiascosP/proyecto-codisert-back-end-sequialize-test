const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Barrio = sequelize.define('Barrio', {
  idBarrio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Barrio: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'barrio',  
  timestamps: true,  
});

module.exports = Barrio;