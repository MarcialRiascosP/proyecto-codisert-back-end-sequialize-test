const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const tipoDocumentoController = require('../controllers/tipoDocumentoController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, tipoDocumentoController.createTipoDocumento); 
router.get('/search-alls', authAdminRegisMiddleware, tipoDocumentoController.getAllTipoDocumentos);
router.get('/search/:id', authAdminRegisMiddleware, tipoDocumentoController.getTipoDocumentoById);
router.put('/update/:id', authAdminRegisMiddleware, tipoDocumentoController.updateTipoDocumento);
router.delete('/delete/:id', authAdminRegisMiddleware, tipoDocumentoController.deleteTipoDocumento);

module.exports = router;