const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const historialCambioController = require('../controllers/historialCambioController');

const router = express.Router();

router.get('/search-alls', authAdminRegisMiddleware, historialCambioController.getAllHistorialCambios);
router.get('/search/:id', authAdminRegisMiddleware, historialCambioController.getHistorialCambioById);
router.delete('/delete/:id', authAdminRegisMiddleware, historialCambioController.deleteHistorialCambio);
router.delete('/delete-alls', authAdminRegisMiddleware, historialCambioController.deleteAllHistorialCambio);

module.exports = router;