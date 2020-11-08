const express = require('express');
const authAdminController = require('../controllers/auth/admin');

const router = express.Router();

router.get('/', authAdminController.isLoggedIn, (req, res)=>{
    res.render("index", {
        user: req.user
    });
})

router.get('/admin', (req, res)=>{
    res.render("adminLogin");
})

router.get('/adminRegister', (req, res)=>{
    res.render("adminRegister");
})

router.get('/adminDash', authAdminController.isLoggedIn, (req, res)=>{
    if(req.user){
        res.render('adminDash', {
            user: req.user
        });
    }
    else{
        res.render('adminLogin');
    }
})

router.get('/user', (req, res)=>{
    res.render("userLogin");
})

module.exports = router;