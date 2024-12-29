'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash('T10F8DA0', 10);

    // Insertar un administrador 'admin_super' con el campo Sexo
    await queryInterface.bulkInsert('administrador', [{
      Nombre: 'Ivan Dario',
      Apellido: 'Valencia',
      TipoDocumento_idTipoDocumento: 1,  // Ajusta este valor según tu base de datos
      NumeroDocumento: '1234567890',     // Ajusta según lo necesario
      Telefono: '123456789',
      Correo: 'superadmin@dominio.com',   // Asegúrate de que este correo sea único
      Password: hashedPassword, // Contraseña encriptada
      Estado_idEstado: 1,                 // Ajusta este valor según tu base de datos
      Rol_idRol: 1,                       // Asegúrate de que el rol `admin_super` esté creado y su ID sea 1
      Administrador_idAdministrador: null, // Es el administrador principal
      Sexo_idSexo: 1,                  // Campo Sexo añadido
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // Eliminar al administrador 'admin_super' basado en el número de documento
    await queryInterface.bulkDelete('administrador', {
      NumeroDocumento: '1234567890',  // Identifica al admin con su número de documento o correo
    }, {});
  }
};
