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