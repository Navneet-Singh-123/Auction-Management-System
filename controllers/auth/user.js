const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});


exports.login = async (req, res)=>{
    
}

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