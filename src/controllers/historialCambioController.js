const { HistorialCambio } = require('../models/HistorialCambio');  // Importar el modelo HistorialCambio
const Administrador = require('../models/Administrador');
const { Beneficiario } = require('../models/Beneficiario');

const historialCambioController = {
  // Obtener todos los registros de historial de cambios
  async getAllHistorialCambios(req, res) {
    try {
      // Obtener todos los registros de historial de cambios, incluyendo los detalles del administrador y beneficiario
      const historialCambios = await HistorialCambio.findAll({
        include: [
          {
            model: Administrador,  // Incluimos el administrador
            attributes: ['idAdministrador', 'Nombre', 'Apellido'],  // Campos del administrador
            as: 'administrador',  // Alias para la relación
          },
          {
            model: Beneficiario,  // Incluimos el beneficiario
            attributes: ['idBeneficiario', 'Nombre', 'Apellido'],  // Campos del beneficiario
            as: 'beneficiario',  // Alias para la relación
          },
        ],
      });
  
      // Verificar si existen registros
      if (historialCambios.length === 0) {
        return res.status(404).json({ message: 'No se encontraron registros en el historial de cambios' });
      }
  
      // Formatear los datos para incluir el nombre y apellido con el id de administrador y beneficiario
      const formattedHistorialCambios = historialCambios.map(historial => ({
        idHistorialCambio: historial.idHistorialCambio,
        Accion: historial.Accion,
        ValorAnterior: historial.ValorAnterior,
        ValorNuevo: historial.ValorNuevo,
        Administrador: {
          idAdministrador: historial.administrador ? historial.administrador.idAdministrador : null,
          Nombre: historial.administrador ? historial.administrador.Nombre : null,
          Apellido: historial.administrador ? historial.administrador.Apellido : null,
        },
        Beneficiario: {
          idBeneficiario: historial.beneficiario ? historial.beneficiario.idBeneficiario : null,
          Nombre: historial.beneficiario ? historial.beneficiario.Nombre : null,
          Apellido: historial.beneficiario ? historial.beneficiario.Apellido : null,
        },
        CreatedAt: historial.createdAt,
        UpdatedAt: historial.updatedAt,
      }));
  
      res.status(200).json({
        message: 'Historial de cambios obtenido exitosamente',
        data: formattedHistorialCambios,
      });
    } catch (err) {
      console.error('Error al obtener el historial de cambios:', err);
      res.status(500).json({
        message: 'Error al obtener el historial de cambios',
        error: err.message,
      });
    }
  },

  async getHistorialCambioById(req, res) {
    const { id } = req.params;  // Obtener el ID del registro a consultar
  
    try {
      // Buscar el registro del historial de cambios por su ID, incluyendo los detalles del administrador y beneficiario
      const historial = await HistorialCambio.findByPk(id, {
        include: [
          {
            model: Administrador,  // Incluimos el administrador
            attributes: ['idAdministrador', 'Nombre', 'Apellido'],  // Campos del administrador
            as: 'administrador',  // Alias para la relación
          },
          {
            model: Beneficiario,  // Incluimos el beneficiario
            attributes: ['idBeneficiario', 'Nombre', 'Apellido'],  // Campos del beneficiario
            as: 'beneficiario',  // Alias para la relación
          },
        ],
      });
  
      // Verificar si se encontró el historial de cambios
      if (!historial) {
        return res.status(404).json({ message: 'Registro de historial de cambios no encontrado' });
      }
  
      // Formatear la respuesta para incluir los detalles de administrador y beneficiario
      const formattedHistorial = {
        idHistorialCambio: historial.idHistorialCambio,
        Accion: historial.Accion,
        ValorAnterior: historial.ValorAnterior,
        ValorNuevo: historial.ValorNuevo,
        Administrador: {
          idAdministrador: historial.administrador ? historial.administrador.idAdministrador : null,
          Nombre: historial.administrador ? historial.administrador.Nombre : null,
          Apellido: historial.administrador ? historial.administrador.Apellido : null,
        },
        Beneficiario: {
          idBeneficiario: historial.beneficiario ? historial.beneficiario.idBeneficiario : null,
          Nombre: historial.beneficiario ? historial.beneficiario.Nombre : null,
          Apellido: historial.beneficiario ? historial.beneficiario.Apellido : null,
        },
        CreatedAt: historial.createdAt,
        UpdatedAt: historial.updatedAt,
      };
  
      res.status(200).json({
        message: 'Registro de historial de cambios encontrado exitosamente',
        data: formattedHistorial,
      });
    } catch (err) {
      console.error('Error al obtener el registro del historial de cambios:', err);
      res.status(500).json({
        message: 'Error al obtener el registro del historial de cambios',
        error: err.message,
      });
    }
  },

  async deleteHistorialCambio(req, res) {
    const { id } = req.params; // ID del historial de cambios a eliminar

    try {
      // Buscar el registro por su ID
      const historialCambio = await HistorialCambio.findByPk(id);

      // Verificar si el registro existe
      if (!historialCambio) {
        return res.status(404).json({ message: 'Registro no encontrado en el historial de cambios' });
      }

      // Eliminar el registro
      await historialCambio.destroy();

      res.status(200).json({ message: 'Registro del historial de cambios eliminado exitosamente' });
    } catch (err) {
      console.error('Error al eliminar el registro del historial de cambios:', err);
      res.status(500).json({
        message: 'Error al eliminar el registro del historial de cambios',
        error: err.message,
      });
    }
  },

  async deleteAllHistorialCambio(req, res) {
    try {
      // Eliminar todos los registros de la tabla HistorialCambio
      const deletedRecords = await HistorialCambio.destroy({
        where: {},
      });

      // Verificar si se eliminaron registros
      if (deletedRecords === 0) {
        return res.status(404).json({ message: 'No se encontraron registros en el historial de cambios para eliminar' });
      }

      res.status(200).json({ message: 'Todos los registros del historial de cambios han sido eliminados exitosamente' });
    } catch (err) {
      console.error('Error al eliminar los registros del historial de cambios:', err);
      res.status(500).json({
        message: 'Error al eliminar los registros del historial de cambios',
        error: err.message,
      });
    }
  },

};

module.exports = historialCambioController;