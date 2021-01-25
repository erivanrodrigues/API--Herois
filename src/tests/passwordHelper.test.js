const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Erivan@!!!!'
const HASH = '$2b$04$ml1RXACq0pZBziM0TITPUeVvsrmw3Uh3tkSVQku88LQc3TO6oqflO'

describe('UserHelper teste SUITE', function () {
    it('deve gerar um HASH a partir de uma SENHA', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)

        assert.ok(result.length > 10)
    })
    it('deve comparar uma SENHA e seu HASH', async () => {
         const result = await PasswordHelper.comparePassword(SENHA, HASH)
         assert.ok(result)
    })
})