const Role = require('../models/Role'); // Asegúrate de importar correctamente el modelo Role

const roleController = {
  // Crear un nuevo Rol
  async createRole(req, res) {
    const { Rol } = req.body; // Extraemos el campo Rol del cuerpo de la solicitud

    // Validar datos de entrada
    if (!Rol) {
      return res.status(400).json({ message: 'El campo Rol es obligatorio' });
    }

    try {
      // Crear un nuevo Rol en la base de datos
      const newRole = await Role.create({ Rol });

      // Responder con éxito
      res.status(201).json({
        message: 'Rol creado exitosamente',
        newRoleId: newRole.idRol, // Devolvemos el ID del nuevo Rol creado
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este Rol ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el Rol', error: err.message });
    }
  },

  // Obtener todos los Roles
  async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll(); // Obtener todos los Roles

      res.status(200).json({
        message: 'Lista de Roles obtenida exitosamente',
        roles,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de Roles', error: err.message });
    }
  },

  // Obtener un Rol por ID
  async getRoleById(req, res) {
    const { id } = req.params;

    try {
      const role = await Role.findByPk(id); // Buscar Rol por su ID

      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      res.status(200).json({
        message: 'Rol encontrado exitosamente',
        role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el Rol', error: err.message });
    }
  },

  // Actualizar un Rol por ID
  async updateRole(req, res) {
    const { id } = req.params;
    const { Rol } = req.body;

    // Validar datos de entrada
    if (!Rol) {
      return res.status(400).json({ message: 'El campo Rol es obligatorio' });
    }

    try {
      const existingRole = await Role.findByPk(id); // Buscar el Rol por ID

      if (!existingRole) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      await existingRole.update({ Rol }); // Actualizar el Rol

      res.status(200).json({ message: 'Rol actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el Rol', error: err.message });
    }
  },

  // Eliminar un Rol por ID
  async deleteRole(req, res) {
    const { id } = req.params;

    try {
      const role = await Role.findByPk(id); // Buscar el Rol por ID

      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      await role.destroy(); // Eliminar el Rol

      res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el Rol', error: err.message });
    }
  },
};

module.exports = roleController;