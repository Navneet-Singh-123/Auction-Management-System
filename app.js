const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');

app.use(express.static(publicDirectory));

// Parsing URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));
// Parsing JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'hbs');

db.connect((error)=>{
    if(error){
        console.log(error); 
    }
    else{
        console.log("MYSQL connected...");
    }
})

// Define Routes
app.use('/', require('./routes/pages'))
app.use('/auth/admin', require('./routes/AuthAdmin'))

app.listen(5000, ()=>{
    console.log("Server Started on port 5000");
})