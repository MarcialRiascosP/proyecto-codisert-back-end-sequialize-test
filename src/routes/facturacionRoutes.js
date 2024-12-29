const express = require('express');
const router = express.Router();
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const authAdminRegisLectMiddleware = require('../middleware/authAdminRegisLectMiddleware');
const facturacionController = require('../controllers/facturacionController');

// Ruta para subir el archivo
router.post('/upload', authAdminRegisMiddleware, facturacionController.uploadMiddleware, facturacionController.uploadFile);
router.get('/search-alls', authAdminRegisLectMiddleware, facturacionController.getAllDocuments);
router.get('/search/:id', authAdminRegisLectMiddleware, facturacionController.getDocumentById);
router.delete('/delete/:idFacturacion', authAdminRegisMiddleware, facturacionController.deleteDocument);

module.exports = router;
