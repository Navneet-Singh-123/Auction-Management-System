const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {promisify} = require('util'); 

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

exports.register = (req, res)=>{
    
    const {name, mobile, password, passwordConfirm, email} = req.body;

    db.query('SELECT email FROM admin WHERE email = ?', [email], async (error, result)=>{
        
        if(error){
            console.log(error);
        }

        if(result.length > 0){
            return res.render("adminRegister", {
                message: "That email is already in use", 
            })
        }   
        else if(password !== passwordConfirm){
            return res.render("adminRegister", {
                message: "Passwords do not Match", 
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO admin SET ?', {
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
                return res.render('adminRegister', {
                    messageSuccess: "User Registered", 
                })
            }
        })
    })
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render("adminLogin", {
                message: "Please provide an Email and Password"
            })
        }  

        db.query("SELECT * FROM admin WHERE email = ?", [email], async(error, results)=>{
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password)) ){
                res.status(401).render("adminLogin", {
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

                res.cookie('jwt', token, cookieOptions);

                res.status(200).redirect("/");

            }
        })
    }catch(error){
        console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next)=>{
    // console.log(req.cookies);
    if(req.cookies.jwt){
        try{
            // Verify the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt, 
                process.env.JWT_SECRET
            )

            // Check if the user still exists
            db.query("SELECT * FROM admin WHERE id = ?", [decoded.id], (error, result)=>{
                console.log(result);

                if(error){
                    console.log(error);
                }

                if(!result){
                    return next();
                }

                req.adminLogin = result[0];

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

exports.logout = async (req, res)=>{
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2000), 
        httpOnly: true
    })
    res.status(200).redirect('/');
}