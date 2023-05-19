const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')


dotenv.config()



class Auth{
    idGenerator = ()=>{
        return uuid.v4()
    }

    
    hash = (txt)=>{
        const rounds = 12
        const salt = bcrypt.genSaltSync(rounds)
        const cypher = bcrypt.hashSync(txt, salt)

        return cypher
    }

    compare = (txt, hash)=>{
        return bcrypt.compareSync(txt, hash)
    }


    token = (payload)=>{
        return jwt.sign(
            { payload },
            process.env.JWT_KEY,
            { expiresIn: '24h' }
        )
    }

    tokenData = (token)=>{
        return jwt.verify(
            token,
            process.env.JWT_KEY
        )
    }

}

module.exports = Auth