const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

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