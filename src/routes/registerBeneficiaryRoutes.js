const express = require('express');
const authAdminRegisMiddleware = require('../middleware/authAdminRegisMiddleware');
const authAdminRegisLectMiddleware = require('../middleware/authAdminRegisLectMiddleware');
const UsarController = require('../controllers/registerBeneficiaryController');
const router = express.Router();

router.post('/register', authAdminRegisMiddleware, UsarController.registerBeneficiary);
router.get('/search-alls', authAdminRegisLectMiddleware, UsarController.getAllBeneficiaries);
router.get('/search/:id', authAdminRegisLectMiddleware, UsarController.getBeneficiaryById);
router.get('/search/beneficiary/:numeroDocumento', authAdminRegisLectMiddleware, UsarController.getBeneficiaryByNumeroDocumento);
router.put('/update/:id', authAdminRegisMiddleware, UsarController.updateBeneficiary);
router.delete('/delete/:id', authAdminRegisMiddleware, UsarController.deleteBeneficiary);

module.exports = router;