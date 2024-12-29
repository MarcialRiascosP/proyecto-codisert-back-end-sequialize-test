const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const viaController = require('../controllers/viaController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, viaController.createVia);       
router.put('/update/:id', authAdminRegisMiddleware, viaController.updateVia);   
router.delete('/delete/:id', authAdminRegisMiddleware, viaController.deleteVia); 
router.get('/search-alls', authAdminRegisMiddleware, viaController.getAllVias);    
router.get('/search/:id', authAdminRegisMiddleware, viaController.getViaById);  

module.exports = router;