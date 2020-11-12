const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

exports.setProductSale = (req, res)=>{
    const index = req.params.idx;
    req.index = index;
    db.query("SELECT * from product WHERE status = 1", (error, results)=>{
        if(error){
            console.log(error);
        }
        const selectedProduct = results[index];
        res.render("index", {
            productForSale: selectedProduct
        })
    })   
}

exports.getAllAdmins = (req, res)=>{
    db.query('SELECT * FROM admin', (error, results)=>{
        if(error){
            console.log(error);
        }
        return res.render("adminList", {
            admins: results
        });
    })
}

exports.getProductsForBid = (req, res) => {
    db.query("SELECT * from product WHERE status = 1", (error, results)=>{
        if(error){
            console.log(error);
        }
        return res.render("availableProducts", {
            products: results
        });
    })
}


exports.getSoldProducts = (req, res) => {
    db.query("SELECT * from product WHERE status = 0", (error, results)=>{
        if(error){
            console.log(error);
        }
        return res.render("soldProducts", {
            products: results
        });
    })
}

exports.isProductForBid = (req,res, next) =>{
    if(req.index){
        db.query("SELECT * from product WHERE status = 1", (error, results)=>{
            if(error){
                console.log(error);
            }
            const selectedProduct = JSON.parse(JSON.stringify(result));
            console.log(selectedProduct);
            next();
        })
    }
    else{
        next();
    }
}