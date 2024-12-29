const Sexos = require('../models/Sexo'); // Importar el modelo Sexo

const sexoController = {
  // Crear un nuevo Sexo
  async createSexo(req, res) {
    const { Sexo } = req.body;

    // Validar datos de entrada
    if (!Sexo) {
      return res.status(400).json({ message: 'El campo Sexo es obligatorio' });
    }

    try {
      // Crear un nuevo registro de Sexo
      const newSexo = await Sexos.create({ Sexo });

      // Responder con éxito
      res.status(201).json({
        message: 'Sexo creado exitosamente',
        newSexoId: newSexo.idSexo,
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Este Sexo ya existe. Por favor, usa otro nombre.',
          error: err.message,
        });
      }

      res.status(500).json({ message: 'Error al crear el Sexo', error: err.message });
    }
  },

  // Actualizar un Sexo
  async updateSexo(req, res) {
    const { id } = req.params;
    const { Sexo } = req.body;

    if (!Sexo) {
      return res.status(400).json({ message: 'El campo Sexo es obligatorio' });
    }

    try {
      const existingSexo = await Sexos.findByPk(id); // Buscar el registro por su ID

      if (!existingSexo) {
        return res.status(404).json({ message: 'Sexo no encontrado' });
      }

      // Actualizar el registro
      await existingSexo.update({ Sexo });

      res.status(200).json({ message: 'Sexo actualizado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el Sexo', error: err.message });
    }
  },

  // Eliminar un Sexo
  async deleteSexo(req, res) {
    const { id } = req.params;

    try {
      const sexo = await Sexos.findByPk(id);
      if (!sexo) {
        return res.status(404).json({ message: 'Sexo no encontrado' });
      }

      await sexo.destroy();
      res.status(200).json({ message: 'Sexo eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el Sexo', error: err.message });
    }
  },

  // Obtener todos los Sexos
  async getAllSexos(req, res) {
    try {
      const sexos = await Sexos.findAll();
      res.status(200).json({
        message: 'Lista de Sexos obtenida exitosamente',
        sexos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de Sexos', error: err.message });
    }
  },

  // Obtener un Sexo por ID
  async getSexoById(req, res) {
    const { id } = req.params;

    try {
      const sexo = await Sexos.findByPk(id);

      if (!sexo) {
        return res.status(404).json({ message: 'Sexo no encontrado' });
      }

      res.status(200).json({
        message: 'Sexo encontrado exitosamente',
        sexo,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el Sexo', error: err.message });
    }
  },
};

module.exports = sexoController;