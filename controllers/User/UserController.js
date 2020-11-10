const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {promisify} = require('util'); 

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

exports.getAllSuppliers = (req, res)=>{
    db.query('SELECT * FROM supplier', (error, results)=>{
        if(error){
            console.log(error);
        }
        // console.log(results);
        return res.render("supplierList", {
            suppliers: results
        });
    })
}

exports.addProduct = async (req, res)=>{

    const {name, basePrice} = req.body;

    const decoded = await promisify(jwt.verify)(
        req.cookies.jwt_supplier, 
        process.env.JWT_SECRET
    )

    const product = {};
     
    product.name = name;
    product.basePrice = basePrice;

    db.query("SELECT * FROM supplier WHERE id = ?", [decoded.id], (error, result)=>{
        console.log(result);
        const supplierData = JSON.parse(JSON.stringify(result));
        if(error){
            console.log(error);
        }

        if(!result){
            return next();
        }   
        // req.supplierName = supplierData[0].name;
        product.owner = supplierData[0].name;
        // console.log("The name of the supplier is: ", req.supplierName);
        // console.log(product);
        db.query('INSERT INTO product SET ?', {
            name: product.name, 
            owner: product.owner, 
            basePrice: product.basePrice
        }, (error, result)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(result);
                return res.render('addProduct', {
                    messageSuccess: "Product Successfully created", 
                })
            }
        })
    })

    
}