'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Datos a insertar
    const sexos = [
      { Sexo: 'Masculino', createdAt: new Date(), updatedAt: new Date() },
      { Sexo: 'Femenino', createdAt: new Date(), updatedAt: new Date() },
      { Sexo: 'Otro', createdAt: new Date(), updatedAt: new Date() }
    ];

    // Insertar los datos en la tabla Sexo
    await queryInterface.bulkInsert('sexo', sexos, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Si necesitamos revertir el seed, podemos eliminar los registros insertados
    await queryInterface.bulkDelete('sexo', null, {});
  }
};
