'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertar los tipos de documento en la tabla 'tipodocumento'
    await queryInterface.bulkInsert('tipodocumento', [
      {
        TipoDocumento: 'Cedula de ciudadanía',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoDocumento: 'Cedula de ciudadanía extranjera',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoDocumento: 'Pasaporte',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Eliminar los tipos de documento de la tabla 'tipodocumento'
    await queryInterface.bulkDelete('tipodocumento', null, {});
  }
};
