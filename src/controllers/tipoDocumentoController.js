// controllers/tipoDocumentoController.js
const TipoDocumentos = require('../models/TipoDocumento'); // Importa el modelo TipoDocumento

const tipoDocumentoController = {
  // Crear un nuevo TipoDocumento
  async createTipoDocumento(req, res) {
    const { TipoDocumento } = req.body; // Extraemos el campo TipoDocumento del cuerpo de la solicitud

    // Validar datos de entrada
    if (!TipoDocumento) {
      return res.status(400).json({ message: 'El campo TipoDocumento es obligatorio' });
    }

    try {
      // Crear un nuevo TipoDocumento en la base de datos
      const newTipoDocumento = await TipoDocumentos.create({ TipoDocumento });

      // Responder con éxito
      res.status(201).json({
        message: 'TipoDocumento creado exitosamente',
        newTipoDocumentoId: newTipoDocumento.idTipoDocumento, // Devolvemos el ID del nuevo TipoDocumento creado
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este TipoDocumento ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el TipoDocumento', error: err.message });
    }
  },

  // Obtener todos los TipoDocumentos
  async getAllTipoDocumentos(req, res) {
    try {
      const tipoDocumentos = await TipoDocumentos.findAll(); // Obtener todos los TipoDocumentos

      res.status(200).json({
        message: 'Lista de TipoDocumentos obtenida exitosamente',
        tipoDocumentos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de TipoDocumentos', error: err.message });
    }
  },

  // Obtener un TipoDocumento por ID
  async getTipoDocumentoById(req, res) {
    const { id } = req.params;

    try {
      const tipoDocumento = await TipoDocumentos.findByPk(id); // Buscar TipoDocumento por su ID

      if (!tipoDocumento) {
        return res.status(404).json({ message: 'TipoDocumento no encontrado' });
      }

      res.status(200).json({
        message: 'TipoDocumento encontrado exitosamente',
        tipoDocumento,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el TipoDocumento', error: err.message });
    }
  },

  // Actualizar un TipoDocumento por ID
  async updateTipoDocumento(req, res) {
    const { id } = req.params;
    const { TipoDocumento } = req.body;

    // Validar datos de entrada
    if (!TipoDocumento) {
      return res.status(400).json({ message: 'El campo TipoDocumento es obligatorio' });
    }

    try {
      const existingTipoDocumento = await TipoDocumentos.findByPk(id); // Buscar el TipoDocumento por ID

      if (!existingTipoDocumento) {
        return res.status(404).json({ message: 'TipoDocumento no encontrado' });
      }

      await existingTipoDocumento.update({ TipoDocumento }); // Actualizar el TipoDocumento

      res.status(200).json({ message: 'TipoDocumento actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el TipoDocumento', error: err.message });
    }
  },

  // Eliminar un TipoDocumento por ID
  async deleteTipoDocumento(req, res) {
    const { id } = req.params;

    try {
      const tipoDocumento = await TipoDocumentos.findByPk(id); // Buscar el TipoDocumento por ID

      if (!tipoDocumento) {
        return res.status(404).json({ message: 'TipoDocumento no encontrado' });
      }

      await tipoDocumento.destroy(); // Eliminar el TipoDocumento

      res.status(200).json({ message: 'TipoDocumento eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el TipoDocumento', error: err.message });
    }
  },
};

module.exports = tipoDocumentoController;