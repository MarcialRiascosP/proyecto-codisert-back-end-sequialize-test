const express = require('express');
const { uploadDocument } = require('../controllers/documentController');
const UsarController = require('../controllers/documentController');
const upload = require('../middleware/uploadMiddleware'); // Middleware para cargar archivos
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware'); // Middleware para cargar archivos
const authAdminRegisLectMiddleware = require('../middleware/authAdminRegisLectMiddleware');

const router = express.Router();

// Ruta para cargar documentos (usamos el middleware de multer)
router.post('/upload/:idBeneficiario', authAdminRegisMiddleware, upload.fields([
    { name: 'contrato', maxCount: 1 },
    { name: 'dni', maxCount: 1 },
    { name: 'declaracion', maxCount: 1 },
    { name: 'fachada', maxCount: 1 },
    { name: 'test', maxCount: 1 },
    { name: 'serial', maxCount: 1 }
  ]), uploadDocument);
router.get('/search-alls', authAdminRegisLectMiddleware, UsarController.getAllDocuments);
router.get('/search/:idDocumentos', authAdminRegisLectMiddleware, UsarController.getDocumentById);
router.get('/search/beneficiary/:idBeneficiario', authAdminRegisLectMiddleware, UsarController.getDocumentsByBeneficiary);
router.delete('/delete/:idDocumentos', authAdminRegisMiddleware, UsarController.deleteDocument);

module.exports = router;
