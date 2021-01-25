const assert = require('assert')
const api = require('../api')

let app = {}
let MOCK_ID = ''
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Jaspion',
    poder: 'Luta bem'
}
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVyaXZhbiIsImlkIjoxLCJpYXQiOjE2MDgwOTA0MTV9.lO7qmReTjjJdQbmEkBCpvYrCqyiU8f686hWilWwFIMg'
const headers = {
    authorization: TOKEN
}

describe('===============Suite de testes da API Heroes ===================', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois', 
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar GET/herois', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10',
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
        //console.log('DADOS ==========',dados)
        //console.log('DADOS statusCode==========',statusCode)

    })
    it('listar GET/herois - dever retornar somente 3 registros', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        //console.log('Somente 3 ', dados)
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })
    it('listar GET/herois - dever retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AAEE'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })
        //console.log('result.payload ========================', result)
        let erroResult = '{"statusCode":400,"error":"Bad Request","message":"child \\"limit\\" fails because [\\"limit\\" must be a number]","validation":{"source":"query","keys":["limit"]}}'

        assert.deepStrictEqual(result.statusCode, 400)
        assert.deepStrictEqual(result.payload, erroResult)
    })
    it('listar GET/herois - dever filtrar um item', async () => {
        const NAME = MOCK_HEROI_INICIAL.nome
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=${NAME}`,
            headers
        })

        const dados = JSON.parse(result.payload)
        //console.log('DADOSSSSS', result) 
        //console.log('STATUSSSS', result.statusCode)
        //console.log('NOMEEEEEE', dados[0].nome)
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
        assert.deepStrictEqual(dados[0].nome, NAME)
    })

    it('cadastrar POST -/herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: MOCK_HEROI_CADASTRAR
        })

        const statusCode = result.statusCode
        console.log('RESULTADO! ', result.payload)
        const {
            message,
            _id
        } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, 'Heroi cadastrado com sucesso!')
    })
    it('atualizar PATCH /herois/:id', async ()=>{
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Luta'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi atualizado com sucesso!')
    })
    it('atualizar PATCH /herois/:id - NÂO deve atualizar com esse ID !', async ()=>{
        const _id = '5fd79080c909c43ba89e9b86'
        const expected = {
            poder: 'Super Luta'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })
        const dados = JSON.parse(result.payload)

        assert.ok(dados.statusCode === 412)
        assert.deepStrictEqual(dados.message, 'Id não encontrado no banco!')
    })
    it('remover DELETE -/herois/:id', async()=>{
        const _id = MOCK_ID
        const result = await app.inject({
            method:'DELETE',
            url: `/herois/${_id}`,
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        
        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi removido com sucesso!') 
    })
    it('remover DELETE -/herois/:id NÂO DEVE REMOVER', async()=>{
        const _id = '5fd79080c909c43ba89e9b86'
        const result = await app.inject({
            method:'DELETE',
            url: `/herois/${_id}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        
        assert.ok(dados.statusCode === 412)
        assert.deepStrictEqual(dados.message, 'Id não encontrado no banco!') 
    })
    it('remover DELETE -/herois/:id NÂO DEVE REMOVER com ID invalido', async()=>{
        const _id = 'ID_INVALIDO'
        const result = await app.inject({
            method:'DELETE',
            url: `/herois/${_id}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        
        assert.ok(dados.statusCode === 500)
        assert.deepStrictEqual(dados.message, 'An internal server error occurred') 
    })
})