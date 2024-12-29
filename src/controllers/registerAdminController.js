const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Administrador = require('../models/Administrador'); // Modelo de Administrador
const Role = require('../models/Role'); // Modelo de Role
const Estado = require('../models/Estado'); // Modelo de Estado
const TipoDocumento = require('../models/TipoDocumento'); // Modelo de Estado
const Sexo = require('../models/Sexo'); // Modelo de Sexo

const registerAdminController = {
  async registerAdmin(req, res) {
    const {
      Nombre,
      Apellido,
      TipoDocumento_idTipoDocumento,
      NumeroDocumento,
      Telefono,
      Correo,
      Password,
      Estado_idEstado,
      Rol_idRol,
      Sexo_idSexo, // Incluir sexo en la solicitud
    } = req.body;

    const idAdministrador = req.user.id; // ID del usuario con sesión activa

    // Validar datos de entrada
    if (!Nombre || !Apellido || !TipoDocumento_idTipoDocumento || !NumeroDocumento || !Correo || !Password || !Estado_idEstado || !Rol_idRol || !Sexo_idSexo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Crear el nuevo administrador usando Sequelize
      const newAdmin = await Administrador.create({
        Nombre,
        Apellido,
        TipoDocumento_idTipoDocumento,
        NumeroDocumento,
        Telefono,
        Correo,
        Password: hashedPassword,
        Estado_idEstado,
        Rol_idRol,
        Sexo_idSexo, // Guardar el sexo del administrador
        Administrador_idAdministrador: idAdministrador,
      });

      res.status(201).json({
        message: 'Administrador registrado exitosamente',
        newAdminId: newAdmin.idAdministrador, // ID del nuevo administrador insertado
      });
    } catch (err) {
      // Manejo del error por duplicados en el campo único
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'El Número de Documento ya está registrado. Por favor, usa uno diferente.',
          error: err.message,
        });
      }

      console.error(err);
      res.status(500).json({ message: 'Error al registrar el administrador', error: err.message });
    }
  },

  async updateAdmin(req, res) {
    const { id } = req.params; // ID del administrador a modificar
    const {
      Nombre,
      Apellido,
      TipoDocumento_idTipoDocumento,
      NumeroDocumento,
      Telefono,
      Correo,
      Password,
      Estado_idEstado,
      Rol_idRol,
      Sexo_idSexo, // Incluir sexo en la solicitud
    } = req.body;

    try {
      // Verificar si el administrador existe
      const existingAdmin = await Administrador.findByPk(id);

      if (!existingAdmin) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      // Verificar si el NumeroDocumento ya está registrado con otro administrador
      const duplicateAdmin = await Administrador.findOne({
        where: {
          NumeroDocumento,
          idAdministrador: { [Op.ne]: id }, // Excluir al administrador actual
        },
      });

      if (duplicateAdmin) {
        return res.status(400).json({
          message: 'El Número de Documento ya está registrado con otro administrador.',
        });
      }

      // Encriptar la contraseña si se proporciona
      let hashedPassword = null;
      if (Password) {
        hashedPassword = await bcrypt.hash(Password, 10);
      }

      // Actualizar los datos del administrador
      await existingAdmin.update({
        Nombre: Nombre || existingAdmin.Nombre,
        Apellido: Apellido || existingAdmin.Apellido,
        TipoDocumento_idTipoDocumento: TipoDocumento_idTipoDocumento || existingAdmin.TipoDocumento_idTipoDocumento,
        NumeroDocumento: NumeroDocumento || existingAdmin.NumeroDocumento,
        Telefono: Telefono || existingAdmin.Telefono,
        Correo: Correo || existingAdmin.Correo,
        Password: hashedPassword || existingAdmin.Password,
        Estado_idEstado: Estado_idEstado || existingAdmin.Estado_idEstado,
        Rol_idRol: Rol_idRol || existingAdmin.Rol_idRol,
        Sexo_idSexo: Sexo_idSexo || existingAdmin.Sexo_idSexo, // Actualizar el sexo si se proporciona
      });

      res.status(200).json({ message: 'Administrador actualizado exitosamente' });
    } catch (err) {
      console.error('Error al actualizar el administrador:', err);
      res.status(500).json({
        message: 'Error al actualizar el administrador',
        error: err.message,
      });
    }
  },

  // Resto de las funciones no necesitan cambios significativos para el campo Sexo
  // Puedes incluir Sexo en las funciones `deleteAdmin`, `getAllAdmins`, y `getAdminById`
  // donde sea necesario para devolver el sexo del administrador.
  
  async deleteAdmin(req, res) {
    const { id } = req.params; // ID del administrador a eliminar

    try {
      // Verificar que el usuario tiene rol admin_super
      if (req.user.role !== 'admin_super') {
        return res.status(403).json({ message: 'No autorizado para realizar esta acción' });
      }

      // Evitar que el admin_super se elimine a sí mismo
      if (req.user.id === parseInt(id, 10)) {
        return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
      }

      // Buscar y eliminar el administrador
      const admin = await Administrador.findByPk(id);
      if (!admin) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      await admin.destroy();
      res.status(200).json({ message: 'Administrador eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el administrador', error: err.message });
    }
  },

  async getAllAdmins(req, res) {
    try {
      const admins = await Administrador.findAll({
        include: [
          {
            model: Role, // Incluir el modelo Role
            attributes: ['Rol'], // Solo incluir el campo 'Rol' de Role
          },
          {
            model: Estado, // Incluir el modelo Estado
            attributes: ['Estado'], // Solo incluir el campo 'Estado' de Estado
          },
          {
            model: TipoDocumento, // Incluir el modelo TipoDocumento
            attributes: ['TipoDocumento'], // Traer el valor de 'TipoDocumento'
          },
          {
            model: Sexo, // Incluir el modelo Sexo
            as: 'SexoCreado', // Usar el alias definido en la relación
            attributes: ['Sexo'], // Traer el valor de 'Sexo'
          },
          {
            model: Administrador, // Incluir el administrador que creó/modificó
            as: 'AdministradorCreado', // Alias usado en la relación auto-referenciada
            attributes: ['idAdministrador', 'Nombre', 'Apellido'], // Solo los campos necesarios del administrador
            required: false, // Asegurarse de que la relación sea opcional
          }
        ],
      });
  
      res.status(200).json({
        message: 'Lista de administradores obtenida exitosamente',
        admins,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error al obtener la lista de administradores',
        error: err.message,
      });
    }
  },

  async getAdminById(req, res) {
    const { id } = req.params; // Obtener el ID del administrador de los parámetros
  
    try {
      // Buscar el administrador por ID
      const admin = await Administrador.findByPk(id, {
        include: [
          Role, // Incluir el modelo Role
          Estado, // Incluir el modelo Estado
          {
            model: TipoDocumento, // Incluir el modelo TipoDocumento
            attributes: ['TipoDocumento'], // Traer solo el valor de 'TipoDocumento'
          },
          {
            model: Sexo, // Incluir el modelo Sexo
            as: 'SexoCreado', // Usar el alias definido en la relación
            attributes: ['Sexo'], // Traer solo el valor de 'Sexo'
          },
          {
            model: Administrador, // Incluir el administrador que lo creó/modificó
            as: 'AdministradorCreado', // Alias para la relación auto-referenciada
            attributes: ['idAdministrador', 'Nombre', 'Apellido'], // Campos que quieres obtener del administrador
            required: false, // Relación opcional, no excluye los administradores sin relación
          }
        ],
      });
  
      // Verificar si el administrador existe
      if (!admin) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }
  
      res.status(200).json({
        message: 'Administrador encontrado exitosamente',
        admin,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error al obtener el administrador',
        error: err.message,
      });
    }
  },
};

module.exports = registerAdminController;