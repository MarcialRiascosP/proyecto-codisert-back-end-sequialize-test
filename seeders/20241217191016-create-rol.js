'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertar roles en la tabla 'rol'
    await queryInterface.bulkInsert('rol', [
      {
        Rol: 'admin_super',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Rol: 'admin_registrador',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Rol: 'admin_lector',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Eliminar los roles de la tabla 'rol'
    await queryInterface.bulkDelete('rol', null, {});
  }
};
