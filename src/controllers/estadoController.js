// controllers/estadoController.js
const Estados = require('../models/Estado'); // Asegúrate de que la importación esté correcta

const estadoController = {
  // Crear un nuevo Estado
  async createEstado(req, res) {
    const { Estado } = req.body;

    // Validar datos de entrada
    if (!Estado) {
      return res.status(400).json({ message: 'El campo Estado es obligatorio' });
    }

    try {
      // Crear un nuevo Estado
      const newEstado = await Estados.create({ Estado });

      // Responder con éxito
      res.status(201).json({
        message: 'Estado creado exitosamente',
        newEstadoId: newEstado.idEstado,
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este Estado ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el Estado', error: err.message });
    }
  },

  // Actualizar un Estado
  async updateEstado(req, res) {
    const { id } = req.params;
    const { Estado } = req.body;

    if (!Estado) {
      return res.status(400).json({ message: 'El campo Estado es obligatorio' });
    }

    try {
      const existingEstado = await Estados.findByPk(id); // Método correcto de Sequelize

      if (!existingEstado) {
        return res.status(404).json({ message: 'Estado no encontrado' });
      }

      await existingEstado.update({ Estado });

      res.status(200).json({ message: 'Estado actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el Estado', error: err.message });
    }
  },

  // Eliminar un Estado
  async deleteEstado(req, res) {
    const { id } = req.params;

    try {
      const estado = await Estados.findByPk(id);
      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado' });
      }

      await estado.destroy();
      res.status(200).json({ message: 'Estado eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el Estado', error: err.message });
    }
  },

  // Obtener todos los Estados
  async getAllEstados(req, res) {
    try {
      const estados = await Estados.findAll();
      res.status(200).json({
        message: 'Lista de Estados obtenida exitosamente',
        estados,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de Estados', error: err.message });
    }
  },

  // Obtener un Estado por ID
  async getEstadoById(req, res) {
    const { id } = req.params;

    try {
      const estado = await Estados.findByPk(id);

      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado' });
      }

      res.status(200).json({
        message: 'Estado encontrado exitosamente',
        estado,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el Estado', error: err.message });
    }
  },
};

module.exports = estadoController;