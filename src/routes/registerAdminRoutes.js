const express = require('express');
const authAdminMiddleware = require('../middleware/authAdminMiddleware');
const UserController = require('../controllers/registerAdminController');
const router = express.Router();

router.post('/register', authAdminMiddleware, UserController.registerAdmin);
router.get('/search-alls', authAdminMiddleware, UserController.getAllAdmins);
router.get('/search/:id', authAdminMiddleware, UserController.getAdminById);
router.put('/update/:id', authAdminMiddleware, UserController.updateAdmin);
router.delete('/delete/:id', authAdminMiddleware, UserController.deleteAdmin);

module.exports = router;