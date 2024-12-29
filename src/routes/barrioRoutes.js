const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const barrioController = require('../controllers/barrioController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, barrioController.createBarrio);       
router.put('/update/:id', authAdminRegisMiddleware, barrioController.updateBarrio);   
router.delete('/delete/:id', authAdminRegisMiddleware, barrioController.deleteBarrio); 
router.get('/search-alls', authAdminRegisMiddleware, barrioController.getAllBarrios);    
router.get('/search/:id', authAdminRegisMiddleware, barrioController.getBarrioById);  

module.exports = router;