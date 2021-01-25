//npm i bcrypt
const Bcrypt = require('bcrypt') // Para criptografar senhas 

const {
    promisify
} = require('util')

// SALT nivel de complexidade da senha  
const SALT = parseInt(process.env.SALT_PWD)

const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)

class PasswordHelper {
    // Criando o HASH com a senha e salt
    static hashPassword(pass){
        return hashAsync(pass, SALT)
    }
    // comparando a senha passada com a do banco
    static comparePassword(pass, hash){
        return compareAsync(pass, hash)
    }

}

module.exports = PasswordHelper