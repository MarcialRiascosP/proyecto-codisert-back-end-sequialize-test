// controllers/estratoController.js
const Estratos = require('../models/Estrato'); // Importa el modelo Estrato

const estratoController = {
  // Crear un nuevo Estrato
  async createEstrato(req, res) {
    const { Estrato } = req.body; // Extraemos el nombre del estrato

    // Validar datos de entrada
    if (!Estrato) {
      return res.status(400).json({ message: 'El campo Estrato es obligatorio' });
    }

    try {
      // Crear un nuevo Estrato
      const newEstrato = await Estratos.create({ Estrato });

      // Responder con éxito
      res.status(201).json({
        message: 'Estrato creado exitosamente',
        newEstratoId: newEstrato.idEstrato,
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este Estrato ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el Estrato', error: err.message });
    }
  },

  // Actualizar un Estrato
  async updateEstrato(req, res) {
    const { id } = req.params; // Obtener el ID del Estrato a modificar
    const { Estrato } = req.body;

    if (!Estrato) {
      return res.status(400).json({ message: 'El campo Estrato es obligatorio' });
    }

    try {
      // Buscar el Estrato por ID
      const existingEstrato = await Estratos.findByPk(id); // Método correcto de Sequelize

      if (!existingEstrato) {
        return res.status(404).json({ message: 'Estrato no encontrado' });
      }

      // Actualizar el Estrato
      await existingEstrato.update({ Estrato });

      res.status(200).json({ message: 'Estrato actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el Estrato', error: err.message });
    }
  },

  // Eliminar un Estrato
  async deleteEstrato(req, res) {
    const { id } = req.params; // Obtener el ID del Estrato a eliminar

    try {
      // Buscar el Estrato por ID
      const estrato = await Estratos.findByPk(id);
      if (!estrato) {
        return res.status(404).json({ message: 'Estrato no encontrado' });
      }

      // Eliminar el Estrato
      await estrato.destroy();
      res.status(200).json({ message: 'Estrato eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el Estrato', error: err.message });
    }
  },

  // Obtener todos los Estratos
  async getAllEstratos(req, res) {
    try {
      // Obtener todos los Estratos
      const estratos = await Estratos.findAll();
      res.status(200).json({
        message: 'Lista de Estratos obtenida exitosamente',
        estratos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error al obtener la lista de Estratos',
        error: err.message,
      });
    }
  },

  // Obtener un Estrato por ID
  async getEstratoById(req, res) {
    const { id } = req.params; // Obtener el ID del Estrato de los parámetros

    try {
      // Buscar el Estrato por ID
      const estrato = await Estratos.findByPk(id);

      if (!estrato) {
        return res.status(404).json({ message: 'Estrato no encontrado' });
      }

      res.status(200).json({
        message: 'Estrato encontrado exitosamente',
        estrato,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error al obtener el Estrato',
        error: err.message,
      });
    }
  },
};

module.exports = estratoController;