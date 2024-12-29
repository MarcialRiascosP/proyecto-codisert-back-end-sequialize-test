'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('via', [
        {
          Via: 'Cra',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Cll',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Mz',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Diag',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Transv',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Km',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Av',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'SIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'Etapa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: '#',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Via: 'UV',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
    },
  
    async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('via', null, {});
    }
  };