"use strict";
require('dotenv').config();
var mysql = require('mysql');

// var mysqlconnection = mysql.createConnection({
//     host : process.env.DB_HOST,
//     user : process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database : process.env.DB_NAME,
//     multipleStatements: true
// });

const mysqlconnection = mysql.createPool({
    connectionLimit : 100, //important
    host : process.env.DB_HOST,
    user : process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    debug    :  false
});

// mysqlconnection.connect((err)=>{
//     if(!err) {
//         console.log("connected");
//     }
//     else {
//         console.log("Not connected");
//     }
// });

module.exports = mysqlconnection;
