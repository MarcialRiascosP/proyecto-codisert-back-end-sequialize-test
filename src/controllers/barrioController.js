const Barrios = require('../models/Barrio'); // Importar el modelo Barrio

const barrioController = {
  // Crear un nuevo Barrio
  async createBarrio(req, res) {
    const { Barrio } = req.body;

    // Validar datos de entrada
    if (!Barrio) {
      return res.status(400).json({ message: 'El campo Barrio es obligatorio' });
    }

    try {
      // Crear un nuevo registro de Barrio
      const newBarrio = await Barrios.create({ Barrio });

      // Responder con éxito
      res.status(201).json({
        message: 'Barrio creado exitosamente',
        newBarrioId: newBarrio.idBarrio,
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este Barrio ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el Barrio', error: err.message });
    }
  },

  // Actualizar un Barrio
  async updateBarrio(req, res) {
    const { id } = req.params;
    const { Barrio } = req.body;

    if (!Barrio) {
      return res.status(400).json({ message: 'El campo Barrio es obligatorio' });
    }

    try {
      const existingBarrio = await Barrios.findByPk(id); // Buscar el registro por su ID

      if (!existingBarrio) {
        return res.status(404).json({ message: 'Barrio no encontrado' });
      }

      // Actualizar el registro
      await existingBarrio.update({ Barrio });

      res.status(200).json({ message: 'Barrio actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el Barrio', error: err.message });
    }
  },

  // Eliminar un Barrio
  async deleteBarrio(req, res) {
    const { id } = req.params;

    try {
      const barrio = await Barrios.findByPk(id);
      if (!barrio) {
        return res.status(404).json({ message: 'Barrio no encontrado' });
      }

      await barrio.destroy();
      res.status(200).json({ message: 'Barrio eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el Barrio', error: err.message });
    }
  },

  // Obtener todos los Barrio
  async getAllBarrios(req, res) {
    try {
      const barrios = await Barrios.findAll();
      res.status(200).json({
        message: 'Lista de Barrios obtenida exitosamente',
        barrios,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de Barrios', error: err.message });
    }
  },

  // Obtener un Barrio por ID
  async getBarrioById(req, res) {
    const { id } = req.params;

    try {
      const barrio = await Barrios.findByPk(id);

      if (!barrio) {
        return res.status(404).json({ message: 'Barrio no encontrado' });
      }

      res.status(200).json({
        message: 'Barrio encontrado exitosamente',
        barrio,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el Barrio', error: err.message });
    }
  },
};

module.exports = barrioController;