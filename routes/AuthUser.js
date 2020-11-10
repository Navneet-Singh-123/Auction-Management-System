const express = require('express');
const userAuthController = require('../controllers/auth/user')
const router = express.Router();



router.post('/supplier/register', userAuthController.registerSupplier);

router.post('/buyer/register', userAuthController.registerBuyer);

router.post('/supplier/login', userAuthController.supplierLogin);

router.get('/supplier/logout', userAuthController.supplierLogout);

router.post('/buyer/login', userAuthController.buyerLogin);

router.get("/buyer/logout", userAuthController.buyerLogout);


module.exports = router;