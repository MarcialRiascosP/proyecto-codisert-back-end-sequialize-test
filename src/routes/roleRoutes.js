const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const roleController = require('../controllers/roleController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, roleController.createRole);
router.get('/search-alls', authAdminRegisMiddleware, roleController.getAllRoles);
router.get('/search/:id', authAdminRegisMiddleware, roleController.getRoleById);
router.put('/update/:id', authAdminRegisMiddleware, roleController.updateRole);
router.delete('/delete/:id', authAdminRegisMiddleware, roleController.deleteRole);

module.exports = router;