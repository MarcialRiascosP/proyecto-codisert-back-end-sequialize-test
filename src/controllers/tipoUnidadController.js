const TipoUnidadd = require('../models/TipoUnidad'); // Importar el modelo TipoUnidad

const tipoUnidadController = {
  // Crear un nuevo TipoUnidad
  async createTipoUnidad(req, res) {
    const { TipoUnidad } = req.body;

    // Validar datos de entrada
    if (!TipoUnidad) {
      return res.status(400).json({ message: 'El campo TipoUnidad es obligatorio' });
    }

    try {
      // Crear un nuevo registro de TipoUnidad
      const newTipoUnidad = await TipoUnidadd.create({ TipoUnidad });

      // Responder con éxito
      res.status(201).json({
        message: 'TipoUnidad creada exitosamente',
        newTipoUnidadId: newTipoUnidad.idTipoUnidad,
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este TipoUnidad ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el TipoUnidad', error: err.message });
    }
  },

  // Actualizar un TipoUnidad
  async updateTipoUnidad(req, res) {
    const { id } = req.params;
    const { TipoUnidad } = req.body;

    if (!TipoUnidad) {
      return res.status(400).json({ message: 'El campo TipoUnidad es obligatorio' });
    }

    try {
      const existingTipoUnidad = await TipoUnidadd.findByPk(id); // Buscar el registro por su ID

      if (!existingTipoUnidad) {
        return res.status(404).json({ message: 'TipoUnidad no encontrado' });
      }

      // Actualizar el registro
      await existingTipoUnidad.update({ TipoUnidad });

      res.status(200).json({ message: 'TipoUnidad actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el TipoUnidad', error: err.message });
    }
  },

  // Eliminar un TipoUnidad
  async deleteTipoUnidad(req, res) {
    const { id } = req.params;

    try {
      const tipoUnidad = await TipoUnidadd.findByPk(id);
      if (!tipoUnidad) {
        return res.status(404).json({ message: 'TipoUnidad no encontrado' });
      }

      await tipoUnidad.destroy();
      res.status(200).json({ message: 'TipoUnidad eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el TipoUnidad', error: err.message });
    }
  },

  // Obtener todos los TipoUnidad
  async getAllTipoUnidades(req, res) {
    try {
      const tipoUnidades = await TipoUnidadd.findAll();
      res.status(200).json({
        message: 'Lista de TipoUnidad obtenida exitosamente',
        tipoUnidades,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de TipoUnidad', error: err.message });
    }
  },

  // Obtener un TipoUnidad por ID
  async getTipoUnidadById(req, res) {
    const { id } = req.params;

    try {
      const tipoUnidad = await TipoUnidadd.findByPk(id);

      if (!tipoUnidad) {
        return res.status(404).json({ message: 'TipoUnidad no encontrado' });
      }

      res.status(200).json({
        message: 'TipoUnidad encontrado exitosamente',
        tipoUnidad,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el TipoUnidad', error: err.message });
    }
  },
};

module.exports = tipoUnidadController;