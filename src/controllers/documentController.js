const Documento = require('../models/Documento');
const { HistorialCambio } = require('../models/HistorialCambio');
const path = require('path');
const fs = require('fs').promises;
const { Beneficiario } = require('../models/Beneficiario');
const Administrador = require('../models/Administrador');

const registerDocumentController = {
  async uploadDocument(req, res) {
    try {
      const { idBeneficiario } = req.params;
      
      // Verificar que se haya cargado un archivo
      if (!req?.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No se ha cargado ningún archivo' });
      }

      // Obtener el ID del administrador desde el usuario autenticado
      const Administrador_idAdministrador = req.user.id;

      // Obtener todos los archivos cargados
      const archivos = Object.getOwnPropertyNames(req.files).map(name => req.files[name][0]);

      // Validar y procesar los archivos cargados
      await Promise.all(
        archivos.map(async (file) => {
          const NombreDocumento = file.filename;
          const TipoDocumento = req.body[`${file.fieldname}_TipoDocumento`]; // Obtener TipoDocumento desde req.body

          // Validar que TipoDocumento no esté vacío
          if (!TipoDocumento) {
            return res.status(400).json({ message: `El tipo de documento para ${file.fieldname} es obligatorio.` });
          }

          // Aquí puedes agregar validaciones de tipo de archivo y tamaño si es necesario
          const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'application/msword']; // Agregar los tipos permitidos
          if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: `El archivo ${file.originalname} tiene un tipo no permitido.` });
          }

          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            return res.status(400).json({ message: `El archivo ${file.originalname} es demasiado grande. El límite es 5MB.` });
          }

          // Insertar el documento en la base de datos
          const documento = await Documento.create({
            NombreDocumento,
            TipoDocumento,
            Url: 'uploads/' + file.filename,
            Beneficiario_idBeneficiario: idBeneficiario,
            Administrador_idAdministrador,
          });

          // Registrar el cambio en HistorialCambio
          await HistorialCambio.create({
            Accion: 'Creación',
            ValorAnterior: 'N/A',
            ValorNuevo: JSON.stringify(documento),
            Administrador_idAdministrador,
            Beneficiario_idBeneficiario: idBeneficiario,
          });
        })
      );

      // Si todo fue bien, respondemos con éxito
      res.status(200).json({ message: 'Archivos cargados y documentos registrados correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al procesar los archivos. Intenta nuevamente más tarde.' });
    }
  },



  // Función para obtener todos los documentos
  async getAllDocuments(req, res) {
    try {
      // Obtener todos los documentos, incluyendo los datos del beneficiario (id, Nombre, Apellido) y del administrador
      const documentos = await Documento.findAll({
        include: [
          {
            model: Beneficiario, // Relación con el modelo Beneficiario
            attributes: ['idBeneficiario', 'Nombre', 'Apellido'], // Traemos id, Nombre y Apellido del beneficiario
            as: 'beneficiario', // Alias de la relación
          },
          {
            model: Administrador, // Relación con el modelo Administrador
            attributes: ['idAdministrador', 'Nombre', 'Apellido'], // Traemos id, Nombre y Apellido del administrador
            as: 'administrador', // Alias de la relación
          }
        ],
      });

      if (documentos.length === 0) {
        return res.status(404).json({ message: 'No hay documentos registrados' });
      }

      // Estructuramos la respuesta para incluir los datos del beneficiario y del administrador dentro de cada documento
      const documentosConBeneficiarioYAdministrador = documentos.map(doc => ({
        idDocumentos: doc.idDocumentos,
        NombreDocumento: doc.NombreDocumento,
        TipoDocumento: doc.TipoDocumento,
        Url: doc.Url,
        Beneficiario: {
          idBeneficiario: doc.beneficiario.idBeneficiario,
          Nombre: doc.beneficiario.Nombre,
          Apellido: doc.beneficiario.Apellido,
        },
        Administrador: {
          idAdministrador: doc.administrador.idAdministrador,
          Nombre: doc.administrador.Nombre,
          Apellido: doc.administrador.Apellido,
        },
      }));

      res.status(200).json({
        message: 'Documentos encontrados',
        documents: documentosConBeneficiarioYAdministrador,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener los documentos', error: err.message });
    }
  },

  // Función para obtener documentos por beneficiario
  async getDocumentsByBeneficiary(req, res) {
    try {
      const { idBeneficiario } = req.params;

      // Buscar los documentos del beneficiario usando Sequelize
      const documentos = await Documento.findAll({
        where: { Beneficiario_idBeneficiario: idBeneficiario },
        include: [
          {
            model: Beneficiario, // Relación con el modelo Beneficiario
            attributes: ['idBeneficiario', 'Nombre', 'Apellido'], // Traemos id, Nombre y Apellido del beneficiario
            as: 'beneficiario',  // Alias para la relación
          },
          {
            model: Administrador, // Relación con el modelo Administrador
            attributes: ['idAdministrador', 'Nombre', 'Apellido'], // Traemos id, Nombre y Apellido del administrador
            as: 'administrador',  // Alias para la relación
          }
        ],
      });

      if (documentos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos para este beneficiario' });
      }

      // Estructuramos la respuesta para incluir los datos del beneficiario y del administrador dentro de cada documento
      const documentosConBeneficiarioYAdministrador = documentos.map(doc => ({
        idDocumentos: doc.idDocumentos,
        NombreDocumento: doc.NombreDocumento,
        TipoDocumento: doc.TipoDocumento,
        Url: doc.Url,
        Beneficiario: {
          idBeneficiario: doc.beneficiario.idBeneficiario,
          Nombre: doc.beneficiario.Nombre,
          Apellido: doc.beneficiario.Apellido,
        },
        Administrador: {
          idAdministrador: doc.administrador.idAdministrador,
          Nombre: doc.administrador.Nombre,
          Apellido: doc.administrador.Apellido,
        },
      }));

      res.status(200).json({
        message: 'Documentos encontrados',
        documents: documentosConBeneficiarioYAdministrador,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener los documentos', error: err.message });
    }
  },

  // Función para obtener un documento por su ID
  async getDocumentById(req, res) {
    try {
      const { idDocumentos } = req.params;  // Obtenemos el id del documento desde los parámetros de la URL

      // Buscar el documento por su ID usando Sequelize e incluir las relaciones con Beneficiario y Administrador
      const documento = await Documento.findOne({
        where: { idDocumentos },  // Filtramos por el id del documento
        include: [
          {
            model: Beneficiario, // Relación con el modelo Beneficiario
            attributes: ['idBeneficiario', 'Nombre', 'Apellido'], // Traemos id, Nombre y Apellido del beneficiario
            as: 'beneficiario',  // Alias para la relación
          },
          {
            model: Administrador, // Relación con el modelo Administrador
            attributes: ['idAdministrador', 'Nombre', 'Apellido'], // Traemos id, Nombre y Apellido del administrador
            as: 'administrador',  // Alias para la relación
          }
        ],
      });

      // Si no se encuentra el documento
      if (!documento) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }

      // Si se encuentra el documento
      res.status(200).json({
        message: 'Documento encontrado',
        document: {
          idDocumentos: documento.idDocumentos,
          NombreDocumento: documento.NombreDocumento,
          TipoDocumento: documento.TipoDocumento,
          Url: documento.Url,
          Beneficiario: {
            idBeneficiario: documento.beneficiario.idBeneficiario,
            Nombre: documento.beneficiario.Nombre,
            Apellido: documento.beneficiario.Apellido,
          },
          Administrador: {
            idAdministrador: documento.administrador.idAdministrador,
            Nombre: documento.administrador.Nombre,
            Apellido: documento.administrador.Apellido,
          },
        },
      });
    } catch (err) {
      console.error('Error al obtener el documento:', err);
      res.status(500).json({ message: 'Error al obtener el documento', error: err.message });
    }
  },

  // Función para eliminar un documento
  async deleteDocument(req, res) {
    try {
      const { idDocumentos } = req.params;
  
      // Buscar el documento para obtener la URL del archivo
      const documento = await Documento.findOne({ where: { idDocumentos } });
  
      if (!documento) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }
  
      // Extraer la ruta relativa del archivo desde Url
      const relativePath = documento.Url.replace(/^http:\/\/localhost:\d+\//, ''); // Elimina "http://localhost:3000/" o similar
      const filePath = path.resolve(__dirname, '../..', relativePath); // Construye la ruta absoluta
  
      // Intentar eliminar el archivo del sistema de archivos
      try {
        await fs.access(filePath); // Verifica si el archivo existe
        await fs.unlink(filePath); // Elimina el archivo
      } catch (err) {
        console.error(`Error al intentar eliminar el archivo: ${filePath}`, err.message);
        // Continuar con la eliminación en la base de datos aunque el archivo no exista
      }
  
      // Registrar el cambio en HistorialCambio antes de eliminar
      await HistorialCambio.create({
        Accion: 'Eliminación',
        ValorAnterior: JSON.stringify(documento),
        ValorNuevo: 'N/A',
        Administrador_idAdministrador: req.user.id,
        Beneficiario_idBeneficiario: documento.Beneficiario_idBeneficiario,
      });
  
      // Eliminar el documento de la base de datos
      await Documento.destroy({
        where: { idDocumentos },
      });
  
      res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } catch (err) {
      console.error('Error al eliminar el documento:', err.message);
      res.status(500).json({ message: 'Error al eliminar el documento', error: err.message });
    }
  },
};

module.exports = registerDocumentController;