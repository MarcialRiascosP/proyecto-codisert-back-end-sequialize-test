const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const estratoController = require('../controllers/estratoController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, estratoController.createEstrato); 
router.put('/update/:id', authAdminRegisMiddleware, estratoController.updateEstrato); 
router.delete('/delete/:id', authAdminRegisMiddleware, estratoController.deleteEstrato); 
router.get('/search-alls', authAdminRegisMiddleware, estratoController.getAllEstratos); 
router.get('/search/:id', authAdminRegisMiddleware, estratoController.getEstratoById); 

module.exports = router;