const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const sexoController = require('../controllers/sexoController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, sexoController.createSexo);       
router.put('/update/:id', authAdminRegisMiddleware, sexoController.updateSexo);   
router.delete('/delete/:id', authAdminRegisMiddleware, sexoController.deleteSexo); 
router.get('/search-alls', authAdminRegisMiddleware, sexoController.getAllSexos);    
router.get('/search/:id', authAdminRegisMiddleware, sexoController.getSexoById);  

module.exports = router;