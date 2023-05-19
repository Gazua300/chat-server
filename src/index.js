const express = require('express')
const cors = require('cors')
const uuid = require('uuid')
const Auth = require('./services/Auth')
const con = require('./connections/connection')
const app = express()


app.use(express.json())
app.use(cors())

const auth = new Auth()

app.post('/users', (req, res)=>{
    var statusCode = 400
    try{

        const { name, whatsapp, email, password, message, genre, music, sports } = req.body

        if(!name || !whatsapp || !email || !password){
            statusCode = 401
            throw new Error('Preencha os campos')
        }

        if(password.length < 6){
            statusCode = 403
            throw new Error('A senha deve ter o mínimo de 6 caracteres')
        }

        const getuser = `SELECT * FROM super_form_users WHERE whatsapp = ${whatsapp}
        AND email = '${email}'`
        
        con.query(getuser, (error, user)=>{
            if(error || user.length === 0){
                const id = uuid.v4()
                const hash = auth.hash(password)
                const sql = `INSERT INTO super_form_users(id, name, whatsapp, password, email, message, genre, music, sports)
                            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`
                con.query(sql, [id, name, whatsapp, hash, email, message, genre, music, sports], (error)=>{
                    if(error){
                        throw new Error(error)
                    }else{
                        res.send(`Usuário ${name} inserido com sucesso`)
                    }
                })
            }else{
                res.status(403).send('Usuário já cadastrado')
            }
        })    

    }catch(e){
        res.status(statusCode).send(e.message || e.sqlMessage)
    }
})

app.get('/users', (req, res)=>{
    con.query(`SELECT * FROM super_form_users`, (error, users)=>{
        if(error){
            res.send(error)
        }else{
            res.send(users)
        }
    })
})

app.post('/login', (req, res)=>{
    var statusCode = 400
    try{

        const { email, password } = req.body

        if(!email || !password){
            statusCode = 401
            throw new Error('Preencha os campos')
        }

        const sql = `SELECT * FROM super_form_users WHERE email = '${email}'`
        
        con.query(sql, (error, user)=>{
            if(error){
                throw new Error(error)
            }else{
                const compare = auth.compare(password, user[0].password)
                const token = auth.token(user[0].id)

                if(!compare){
                    res.status(404).send('Usuário não encontrado')
                }else{
                    res.status(200).send(user[0])
                }
            }
        })

    }catch(e){
        res.status(statusCode).send(e.message || e.sqlMessage)
    }
})



app.listen(process.env.PORT || 3003, ()=>{
    console.log('Server is running')
})