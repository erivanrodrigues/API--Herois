const assert = require('assert')
const MongoBb = require('./../db/strategies/mongodb/mongodb')
const HehoiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Capitão America',
    poder: 'Escudo Magico'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super Teia'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ID = ''
let context = {}
describe('=======================MongoBb Suite de testes================= ', function () {
    this.beforeAll(async () => {
        const connection = MongoBb.connect()
        context = new Context(new MongoBb(connection, HehoiSchema))
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })
    it('verificar conexao', async () => {
        const result = await context.isConnected()
        console.log('result', result)
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })
    it('cadastrar', async () => {
        const {
            nome,
            poder
        } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepStrictEqual({
            nome,
            poder
        }, MOCK_HEROI_CADASTRAR)
    })
    it('listar', async () => {
        //const result1 = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
        //console.log('RESULT ',result1)
        const [{
            nome,
            poder
        }] = await context.read({
            nome: MOCK_HEROI_DEFAULT.nome
        })
        const result = {
            nome,
            poder
        }
        assert.deepStrictEqual(result, MOCK_HEROI_DEFAULT)
    })
    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.nModified, 1)
    })
    it('remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.n, 1)
    })
})