const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')


const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro 4',
    poder: 'Flexa'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro' 
}

let context = {}
describe('========================Postgres Strategy======================', function () {
    this.timeout(Infinity)
    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
    })

    it('PostgresSQL Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('cadastrar', async function () {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('listar', async function () {
        const [result] = await context.read({
            nome: MOCK_HEROI_CADASTRAR.nome
        })
        delete result.id
        //pegar a primeira posição 
        // const posicaoZero = result[0]
        // const [posicao1, posicao2 ] = ['esse e o 1', 'esse e o 2']
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('atualizar', async function (){
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha2'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({id: itemAtualizar.id})
        assert.deepEqual(result, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
    /**
     * No javaScript temos uma tecnicar chamada REST/SPREAD que é usado para mergear objetos ou separa-los
     */    
    })
    it('remover por id', async function() {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)
    })
    
})