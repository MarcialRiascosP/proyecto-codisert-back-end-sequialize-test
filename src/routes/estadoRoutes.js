const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const estadoController = require('../controllers/estadoController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, estadoController.createEstado);
router.put('/update/:id', authAdminRegisMiddleware, estadoController.updateEstado);
router.delete('/delete/:id', authAdminRegisMiddleware, estadoController.deleteEstado);
router.get('/search-alls', authAdminRegisMiddleware, estadoController.getAllEstados);
router.get('/search/:id', authAdminRegisMiddleware, estadoController.getEstadoById);

module.exports = router;