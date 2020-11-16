const express = require('express');
const authAdminController = require('../controllers/auth/admin');
const authUserController = require('../controllers/auth/user');
const adminController = require('../controllers/Admin/AdminController');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

const router = express.Router();

router.get('/productDetails', (req, res)=>{
    const id = req.cookies.pid;
    db.query("SELECT * FROM product WHERE id = ?", [id], (error, results)=>{
        if(error){
            console.log(error);
        }
        res.render("productDetails", {
            product: results[0]
        })
    })
})

router.get('/userOptions', (req, res)=>{
    res.render('userOption');
})

router.get('/adminErr', (req, res)=>{
    res.render("adminErr");
})

router.get('/', authAdminController.isLoggedIn, (req, res)=>{
    // console.log(req.selectedProduct);
    // console.log(req.cookies.pid);
    if(req.cookies.pid){
        db.query("SELECT * FROM product WHERE id = ?", [req.cookies.pid], (error, results)=>{
            if(error){
                console.log(error);
            }
            const productName = results[0].name
            const basePrice = results[0].basePrice;
            // console.log(productName);
            // console.log(basePrice);
            res.render("index", {
                admin: req.adminLogin,
                name: productName, 
                price: basePrice,
                toShow: true
            });
        })
    }
    else{
        res.render("index", {
            admin: req.adminLogin,
            toShow: false
        });
    }


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

router.get("/buyerLogin", authUserController.isBuyerLoggedIn, (req, res)=>{
    if(req.buyerLogin){
        res.render("buyerDash", {
            buyer: req.buyerLogin
        })
    }
    else{
        res.render("buyerLogin");
    }
})

router.get('/addProduct', (req, res)=>{
    res.render('addProduct');
})

router.get("/selectProductList", adminController.getProductsForBid);

router.get("/soldProductList", adminController.getSoldProducts);

router.get("/product/:idx", (req, res)=>{
    const index = req.params.idx;
    // console.log(index);
    db.query("SELECT * from product WHERE status = 1", (error, results)=>{
        if(error){
            console.log(error);
        }
        const selectedProduct = results[index];
        const id = selectedProduct.id;
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
            ),
            httpOnly: true
        }
        res.cookie('pid', id, cookieOptions);
        res.status(200).redirect("/");
    }) 
});

router.get("/productsoldDetail/:idx", (req, res)=>{
    const index = req.params.idx;
    db.query("SELECT * from product WHERE status = 0", (error, results)=>{
        if(error){
            console.log(error);
        }
        const soldProduct = results[index];
        res.render("productDetails", {
            product: soldProduct
        })
    }) 
})


router.get('/removeProduct', (req, res)=>{
    res.clearCookie("pid");
    res.status(200).redirect('/');
})

router.get("/placeBid", (req, res)=>{
    if(req.cookies.pid){
        const id = req.cookies.pid;
        db.query("SELECT * FROM product WHERE id = ?", [id], (error, results)=>{
            if(error){
                console.log(error);
            }
            db.query("SELECT * FROM bidproduct WHERE productId = ? ORDER BY bidPrice desc",[id],  (err, ans)=>{
                if(err){
                    console.log(err);
                }
                else if(ans.length==0){
                    res.render("placeBid",{
                        product: results[0], 
                        none: true
                    })
                }
                else{
                    res.render("placeBid", {
                        product: results[0], 
                        highest: ans[0]
                    })
                }
            })
        })
    }
    else{
        res.render("placeBid");
    }
})

module.exports = router;