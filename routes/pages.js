const express = require('express');
const authAdminController = require('../controllers/auth/admin');
const authUserController = require('../controllers/auth/user');

const router = express.Router();

router.get('/userOptions', (req, res)=>{
    res.render('userOption');
})

router.get('/adminErr', (req, res)=>{
    res.render("adminErr");
})

router.get('/', authAdminController.isLoggedIn, (req, res)=>{
    res.render("index", {
        admin: req.adminLogin
    });
})

router.get('/admin', (req, res)=>{
    res.render("adminLogin");
})

router.get('/adminRegister', (req, res)=>{
    res.render("adminRegister");
})

router.get('/adminDash', authAdminController.isLoggedIn, (req, res)=>{
    if(req.adminLogin){
        res.render('adminDash', {
            admin: req.adminLogin
        });
    }
    else{
        res.render('adminLogin');
    }
})

router.get('/user', (req, res)=>{
    res.render("userLogin");
})

router.get('/supplierRegister', (req, res)=>{
    res.render("supplierRegister")
})

router.get('/buyerRegister', (req, res)=>{
    res.render("buyerRegister");
})

router.get("/supplierLogin", authUserController.isSupplierLoggedIn, (req, res)=>{
    if(req.supplierLogin){
        res.render('supplierDash', {
            supplier: req.supplierLogin
        });
    }
    else{
        res.render('supplierLogin');
    }
})

router.get("/buyerLogin", (req, res)=>{
    res.render("buyerLogin");
})



module.exports = router;