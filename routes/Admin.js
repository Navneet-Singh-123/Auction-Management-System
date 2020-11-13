const express = require('express');
const adminController = require('../controllers/Admin/AdminController')

const router = express.Router();

router.get('/all', adminController.getAllAdmins);

router.get('/status', adminController.biddingStatus)

router.get('/confirm/sale', adminController.confirmSale);

module.exports = router;