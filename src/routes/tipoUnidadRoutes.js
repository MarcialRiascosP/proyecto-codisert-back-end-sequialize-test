const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const tipoUnidadController = require('../controllers/tipoUnidadController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, tipoUnidadController.createTipoUnidad);       
router.put('/update/:id', authAdminRegisMiddleware, tipoUnidadController.updateTipoUnidad);   
router.delete('/delete/:id', authAdminRegisMiddleware, tipoUnidadController.deleteTipoUnidad); 
router.get('/search-alls', authAdminRegisMiddleware, tipoUnidadController.getAllTipoUnidades);    
router.get('/search/:id', authAdminRegisMiddleware, tipoUnidadController.getTipoUnidadById);  

module.exports = router;