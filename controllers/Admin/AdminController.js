const { response } = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

exports.biddingStatus = (req, res)=>{
    const id = req.cookies.pid;
    if(id){
        db.query("SELECT * FROM product WHERE id = ?", [id], (error, results)=>{
            if(error){
                console.log(error);
            }
            const product = results[0];
    
            db.query("SELECT * FROM bidproduct WHERE productId = ? ORDER BY bidPrice desc",[id],  (err, ans)=>{
                if(err){
                    console.log(err);
                }
                else if(ans.length==0){
                    res.render("biddingStatus",{
                        product: product, 
                        done: true,
                        buyerName: "No buyer yet", 
                        bidPrice: "Not Available"
                    })
                }
                else{
                    res.render("biddingStatus", {
                        product: product, 
                        done: true, 
                        buyerName: ans[0].buyerName, 
                        bidPrice: ans[0].bidPrice
                    })
                }
            })
        })
    }
    else{
        res.render("biddingStatus", {
            done: false
        })
    }
}

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

exports.confirmSale = (req, res)=>{
    const id = req.cookies.pid; 
    if(id){
        db.query("SELECT * FROM bidproduct WHERE productId = ? ORDER BY bidPrice desc",[id],  (err, ans)=>{
            if(err){
                console.log(err);
            }
            const bid_product = ans[0];

            if(bid_product){
                db.query("SELECT * FROM product WHERE id = ?", [id], (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        db.query("UPDATE product SET status = 0, buyerName = ?, soldAt = ? WHERE id = ?",
                            [bid_product.buyerName, bid_product.bidPrice, result[0].id], (err, resp)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    db.query("DELETE FROM bidProduct WHERE productId = ?", [id], (error, r)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        else{
                                            res.clearCookie("pid");
                                            res.render("biddingStatus", {
                                                messageSuccess: "Product is Sold successfully",
                                                done: true
                                            })
                                        }
                                    })
 
                                }
                            } 
                        )
                    }
                })
            }
            else{
                db.query("SELECT * FROM product WHERE id = ?", [id], (err, product)=>{
                    if(err){
                        console.log(err);
                    }  
                    else{
                        res.render("biddingStatus", {
                            message: "No buyer is available for this product.",
                            product: product[0], 
                            done: true, 
                            buyerName: "No buyer Yet",
                            bidPrice: "Not available"
                        })
                    }
                })
                

            }
            
            
        })
    }  
    else{
        res.render("biddingStatus", {
            message: "No product is Selected for Auction", 
            done: false
        })
    } 

}