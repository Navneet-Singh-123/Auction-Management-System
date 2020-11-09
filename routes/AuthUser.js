const express = require('express');
const userAuthController = require('../controllers/auth/user')
const router = express.Router();


router.post('/login', userAuthController.login);

router.post('/supplier/register', userAuthController.registerSupplier);

router.post('/buyer/register', userAuthController.registerBuyer);

router.post('/supplier/login', userAuthController.supplierLogin);

router.get('/supplier/logout', userAuthController.supplierLogout);


module.exports = router;