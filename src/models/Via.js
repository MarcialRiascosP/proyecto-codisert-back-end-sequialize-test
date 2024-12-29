const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Via = sequelize.define('Via', {
  idVia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Via: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'via',  
  timestamps: true,  
});

module.exports = Via;