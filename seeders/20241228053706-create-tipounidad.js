'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipounidad', [
      {
        TipoUnidad: 'APTO',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'BL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'CASA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'CONS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'ESQU',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'INT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'LOCAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'OFIC',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'PISO',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'PUNTOS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        TipoUnidad: 'TORRE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipounidad', null, {});
  }
};
