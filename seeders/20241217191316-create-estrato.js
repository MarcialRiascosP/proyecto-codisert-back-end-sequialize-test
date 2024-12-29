'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertar los estratos en la tabla 'estrato'
    await queryInterface.bulkInsert('estrato', [
      {
        Estrato: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Estrato: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Estrato: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Estrato: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Estrato: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Estrato: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Eliminar los estratos de la tabla 'estrato'
    await queryInterface.bulkDelete('estrato', null, {});
  }
};
