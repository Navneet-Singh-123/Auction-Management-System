const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {promisify} = require('util'); 

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

exports.placebid = (req, res)=>{
    const curBidPrice = parseInt(req.body.bid);
    const id = req.cookies.pid;
    db.query("SELECT * FROM product WHERE id = ?", [id], async (error, results)=>{
        if(error){
            console.log(error);
        }
        const productId = results[0].id;
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt_buyer, 
            process.env.JWT_SECRET
        )
        db.query("SELECT * FROM buyer WHERE id = ?", [decoded.id], (error, result)=>{
            if(error){
                console.log(error);
            }
            const buyerName = result[0].name;
            db.query('INSERT INTO bidProduct SET ?', {
                productId: productId, 
                buyerName: buyerName, 
                bidPrice: curBidPrice
            }, (error, result)=>{
                if(error){
                    console.log(error);
                }
                else{
                    db.query("SELECT * FROM bidproduct WHERE productId = ? ORDER BY bidPrice desc",[productId],  (err, ans)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("placeBid", {
                                highest: ans[0]
                            })
                        }
                    })
                }
            })
        })
    })
}

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
exports.getAllBuyers = (req, res)=>{
    db.query('SELECT * FROM buyer', (error, results)=>{
        if(error){
            console.log(error);
        }
        // console.log(results);
        return res.render("buyerList", {
            buyers: results
        });
    })
}

exports.getAllProducts = (req, res)=>{
    db.query('SELECT * FROM product', (error, results)=>{
        if(error){
            console.log(error);
        }
        // console.log(results);
        return res.render("productList", {
            products: results
        });
    })
}

exports.addProduct = async (req, res)=>{

    const {name, basePrice, detail} = req.body;

    const decoded = await promisify(jwt.verify)(
        req.cookies.jwt_supplier, 
        process.env.JWT_SECRET
    )

    const product = {};
     
    product.name = name;
    product.basePrice = basePrice;
    product.detail = detail;

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
            basePrice: product.basePrice, 
            detail: product.detail
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