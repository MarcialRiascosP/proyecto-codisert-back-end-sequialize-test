const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Aquí asumo que tienes tu instancia de sequelize configurada

const TipoDocumento = sequelize.define('TipoDocumento', {
  idTipoDocumento: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  TipoDocumento: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  tableName: 'tipodocumento',  // El nombre de la tabla en la base de datos
  timestamps: true           // Desactivar los campos `createdAt` y `updatedAt`

});

module.exports = TipoDocumento;