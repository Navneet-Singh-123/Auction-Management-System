const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {promisify} = require('util'); 

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});




exports.registerSupplier = (req, res)=>{

    const {name, mobile, password, passwordConfirm, email} = req.body;

    db.query("SELECT email FROM supplier WHERE email = ?", [email], async (error, result)=>{
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            return res.render("supplierRegister", {
                message: "A Supplier with this email already exist", 
            })
        } 
        else if(password !== passwordConfirm){
            return res.render("supplierRegister", {
                message: "Passwords do not Match", 
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO supplier SET ?', {
            name: name, 
            mobile: mobile, 
            email: email, 
            password: hashedPassword
        }, (error, result)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(result);
                return res.render('supplierRegister', {
                    messageSuccess: "Supplier Registered", 
                })
            }
        })
    })
}


exports.registerBuyer = (req, res)=>{

    const {name, mobile, password, passwordConfirm, email} = req.body;

    db.query("SELECT email FROM buyer WHERE email = ?", [email], async (error, result)=>{
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            return res.render("buyerRegister", {
                message: "A Buyer with this email already exist", 
            })
        } 
        else if(password !== passwordConfirm){
            return res.render("buyerRegister", {
                message: "Passwords do not Match", 
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO buyer SET ?', {
            name: name, 
            mobile: mobile, 
            email: email, 
            password: hashedPassword
        }, (error, result)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(result);
                return res.render('buyerRegister', {
                    messageSuccess: "Buyer Registered", 
                })
            }
        })
    })
}

exports.supplierLogin = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render("supplierLogin", {
                message: "Please provide an Email and Password"
            })
        }  

        db.query("SELECT * FROM supplier WHERE email = ?", [email], async(error, results)=>{
            console.log(results);

            if(error){
                console.log(error);
                res.status(422).render("supplierLogin", {
                    message: "Something went wrong. Please try Again"
                })
            }

            else if(results.length == 0){
                res.status(401).render("supplierLogin", {
                    message: "A Supplier with this Email does not exist. Please Register yourself by the Admin."
                })
            }

            else if(!results || !(await bcrypt.compare(password, results[0].password)) ){
                res.status(401).render("supplierLogin", {
                    message: "Email or Password is incorrect"
                })
            }
            else{
                const id = results[0].id;

                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                console.log("The Token is: " + token);
                
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt_supplier', token, cookieOptions);

                res.status(200).redirect("/userOptions");

            }
        })
    }catch(error){
        console.log(error);
    }
}


exports.isSupplierLoggedIn = async (req, res, next)=>{
    // console.log(req.cookies);
    if(req.cookies.jwt_supplier){
        try{
            // Verify the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt_supplier, 
                process.env.JWT_SECRET
            )

            // Check if the user still exists
            db.query("SELECT * FROM supplier WHERE id = ?", [decoded.id], (error, result)=>{
                console.log(result);

                if(error){
                    console.log(error);
                }

                if(!result){
                    return next();
                }

                req.supplierLogin = result[0];

                return next();
            })

        }catch(err){
            console.log(err);
            return next();
        }
    }
    else{
        next();
    }
}

exports.supplierLogout = async (req, res)=>{
    res.cookie('jwt_supplier', 'logout', {
        expires: new Date(Date.now() + 2000), 
        httpOnly: true
    })
    res.status(200).redirect('/userOptions');
} 

exports.buyerLogout = async (req, res)=>{
    res.cookie('jwt_buyer', 'logout', {
        expires: new Date(Date.now() + 2000), 
        httpOnly: true
    })
    res.status(200).redirect('/userOptions');
} 

exports.buyerLogin = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render("buyerLogin", {
                message: "Please provide an Email and Password"
            })
        }  

        db.query("SELECT * FROM buyer WHERE email = ?", [email], async(error, results)=>{
            console.log(results);

            if(error){
                console.log(error);
                res.status(422).render("buyerLogin", {
                    message: "Something went wrong. Please try Again"
                })
            }

            else if(results.length == 0){
                res.status(401).render("buyerLogin", {
                    message: "A Buyer with this Email does not exist. Please Register yourself by the Admin."
                })
            }

            else if(!results || !(await bcrypt.compare(password, results[0].password)) ){
                res.status(401).render("buyerLogin", {
                    message: "Email or Password is incorrect"
                })
            }
            else{
                const id = results[0].id;

                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                console.log("The Token is: " + token);
                
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt_buyer', token, cookieOptions);

                res.status(200).redirect("/userOptions");

            }
        })
    }catch(error){
        console.log(error);
    }
}

exports.isBuyerLoggedIn = async (req, res, next)=>{
    // console.log(req.cookies);
    if(req.cookies.jwt_buyer){
        try{
            // Verify the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt_buyer, 
                process.env.JWT_SECRET
            )

            // Check if the user still exists
            db.query("SELECT * FROM buyer WHERE id = ?", [decoded.id], (error, result)=>{
                console.log(result);

                if(error){
                    console.log(error);
                }

                if(!result){
                    return next();
                }

                req.buyerLogin = result[0];

                return next();
            })

        }catch(err){
            console.log(err);
            return next();
        }
    }
    else{
        next();
    }
}