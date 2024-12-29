const Vias = require('../models/Via'); // Importar el modelo Via

const viaController = {
  // Crear un nuevo Via
  async createVia(req, res) {
    const { Via } = req.body;

    // Validar datos de entrada
    if (!Via) {
      return res.status(400).json({ message: 'El campo Via es obligatorio' });
    }

    try {
      // Crear un nuevo registro de Via
      const newVia = await Vias.create({ Via });

      // Responder con éxito
      res.status(201).json({
        message: 'Via creada exitosamente',
        newViaId: newVia.idVia,
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este Via ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el Via', error: err.message });
    }
  },

  // Actualizar un Via
  async updateVia(req, res) {
    const { id } = req.params;
    const { Via } = req.body;

    if (!Via) {
      return res.status(400).json({ message: 'El campo Via es obligatorio' });
    }

    try {
      const existingVia = await Vias.findByPk(id); // Buscar el registro por su ID

      if (!existingVia) {
        return res.status(404).json({ message: 'Via no encontrado' });
      }

      // Actualizar el registro
      await existingVia.update({ Via });

      res.status(200).json({ message: 'Via actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el Via', error: err.message });
    }
  },

  // Eliminar un Via
  async deleteVia(req, res) {
    const { id } = req.params;

    try {
      const via = await Vias.findByPk(id);
      if (!via) {
        return res.status(404).json({ message: 'Via no encontrado' });
      }

      await via.destroy();
      res.status(200).json({ message: 'Via eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el Via', error: err.message });
    }
  },

  // Obtener todos los Via
  async getAllVias(req, res) {
    try {
      const vias = await Vias.findAll();
      res.status(200).json({
        message: 'Lista de Vias obtenida exitosamente',
        vias,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de Vias', error: err.message });
    }
  },

  // Obtener un Via por ID
  async getViaById(req, res) {
    const { id } = req.params;

    try {
      const via = await Vias.findByPk(id);

      if (!via) {
        return res.status(404).json({ message: 'Via no encontrado' });
      }

      res.status(200).json({
        message: 'Via encontrado exitosamente',
        via,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el Via', error: err.message });
    }
  },
};

module.exports = viaController;