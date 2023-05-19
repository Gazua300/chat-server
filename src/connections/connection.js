const mysql = require('mysql2')
const { config } = require('dotenv')

config()


const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
})

con.connect(error=>{
    if(error){
        console.log('Failed to connect to database')
    }else{
        console.log('Connected to database')
    }
})

module.exports = con