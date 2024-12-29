const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Aquí asumo que tienes tu instancia de sequelize configurada
const { Beneficiario } = require('../models/Beneficiario');
const Administrador = require('./Administrador');

const Documento = sequelize.define('Documento', {
  idDocumentos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreDocumento: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  TipoDocumento: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    get() {
      const url = this.getDataValue('Url');  // Obtén el valor del campo 'url'
      const host = process.env.HOST_URL || 'http://localhost:3000/';  // Usa la variable de entorno o un valor predeterminado
      return url ? `${host}${url}` : null;  // Devuelve la URL completa
    },
  },
  Beneficiario_idBeneficiario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Administrador_idAdministrador: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'documentos',
  timestamps: true, // Si no usas campos de timestamps, ponlo como false
});

Documento.belongsTo(Beneficiario, {
  foreignKey: 'Beneficiario_idBeneficiario',  // Clave foránea en Documento
   targetKey: 'idBeneficiario',  // Clave primaria en Beneficiario
   as: 'beneficiario',  // Alias para la relación
});

Documento.belongsTo(Administrador, {
  foreignKey: 'Administrador_idAdministrador',  // Clave foránea en Documento
  targetKey: 'idAdministrador',  // Clave primaria en Beneficiario
  as: 'administrador',  // Alias para la relación
});

module.exports = Documento;