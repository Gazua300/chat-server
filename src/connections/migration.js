const con = require('./connection')

con.promise().query(`
    CREATE TABLE super_form_users(id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL, whatsapp INT NOT NULL, email VARCHAR(255) NOT NULL,
    message TEXT, genre VARCHAR(20), music TEXT, sports TEXT);
`).then(()=>{
    console.log('Table created')
}).catch(e=>{
    console.log('Failed to create table', e)
}).finally(()=>{
    console.log('Thanks a lot!')
})