const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

exports.register = (req, res)=>{
    console.log(req.body);

    const {name, mobile, password, passwordConfirm, email} = req.body;

    db.query('SELECT email FROM admin WHERE email = ?', [email], async (error, result)=>{
        
        if(error){
            console.log(error);
        }

        if(result.length > 0){
            return res.render("adminRegister", {
                message: "That email is already in use"
            })
        }   
        else if(password !== passwordConfirm){
            return res.render("adminRegister", {
                message: "Passwords do not Match"
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
                    message: "User Registered"
                })
            }
        })
    })
}