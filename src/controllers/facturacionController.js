const Facturacion = require('../models/Facturacion');
const fs = require('fs').promises; // Usamos fs.promises para manejar promesas con fs
const path = require('path');
const upload = require('../middleware/uploadMiddleware');

const facturacionController = {
  // Subir un archivo
  async uploadFile(req, res) {
    try {
      // Verifica si el archivo ha sido enviado
      if (!req.file) {
        return res.status(400).json({ message: 'No se ha enviado ningún archivo.' });
      }
  
      const { originalname, filename } = req.file;
      const url = `uploads/${filename}`;  // Solo la ruta relativa
  
      // Guardar el documento en la base de datos
      const newDocument = await Facturacion.create({
        NombreDocumento: originalname, // Nombre original del archivo
        Url: url, // Solo la ruta relativa al archivo
      });
  
      res.status(201).json({
        message: 'Archivo subido y registrado correctamente.',
        documento: newDocument,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al subir el archivo.', error });
    }
  },

  // Obtener todos los documentos
  async getAllDocuments(req, res) {
    try {
      // Obtener todos los documentos de la base de datos
      const documents = await Facturacion.findAll();

      if (documents.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos.' });
      }

      res.status(200).json({
        message: 'Documentos obtenidos correctamente.',
        documentos: documents,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los documentos.', error });
    }
  },

  // Obtener un documento por su ID
  async getDocumentById(req, res) {
    try {
      const { idFacturacion } = req.params;

      // Buscar el documento en la base de datos
      const document = await Facturacion.findByPk(idFacturacion);

      if (!document) {
        return res.status(404).json({ message: 'Documento no encontrado.' });
      }

      res.status(200).json({
        message: 'Documento obtenido correctamente.',
        documento: document,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el documento.', error });
    }
  },

  // Eliminar un documento
  async deleteDocument(req, res) {
    try {
      const { idFacturacion } = req.params;
      
      console.log(`ID de facturación recibido: ${idFacturacion}`); // Imprime el ID recibido en los parámetros
  
      // Buscar el documento para obtener la URL del archivo
      const facturacion = await Facturacion.findOne({ where: { idFacturacion } });
  
      if (!facturacion) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }
  
      // Imprimir el objeto de facturación completo para ver qué datos contiene
      console.log('Facturación encontrada:', facturacion);
  
     // Extraer la ruta relativa del archivo desde Url
     const relativePath = facturacion.Url.replace(/^http:\/\/localhost:\d+\//, ''); // Elimina "http://localhost:3000/" o similar
     const filePath = path.resolve(__dirname, '../..', relativePath); // Construye la ruta absoluta
 
  
      console.log(`Intentando eliminar el archivo en la ruta: ${filePath}`);
  
      // Intentar eliminar el archivo del sistema de archivos
      try {
        await fs.unlink(filePath); // Usamos fs.promises.unlink para eliminar el archivo
        console.log(`Archivo eliminado exitosamente en la ruta: ${filePath}`);
      } catch (err) {
        console.error(`Error al eliminar el archivo: ${filePath}`, err);
        return res.status(500).json({ message: 'No se pudo eliminar el archivo del servidor', error: err.message });
      }
  
      // Eliminar el documento de la base de datos
      await Facturacion.destroy({
        where: { idFacturacion },
      });
  
      res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } catch (err) {
      console.error('Error al eliminar el documento:', err);
      res.status(500).json({ message: 'Error al eliminar el documento', error: err.message });
    }
  },
  
  // Usamos el middleware de multer para la carga del archivo
  uploadMiddleware: upload.single('archivo'), // 'archivo' es el nombre del campo en el formulario
};

module.exports = facturacionController;