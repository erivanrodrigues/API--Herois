//npm i hapi
const Hapi = require('hapi') // Importando o HAPI
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
//Inicializar o HAPI
const app = new Hapi.Server({
    port: 5000
})

async function main() {
    // Preparando as conexão
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))
    app.route([{
        path: '/herois',
        method: 'GET',
        handler: (require, head) => {
            return context.read()
        }
    }])
    await app.start()
    console.let('Servidor rodando na porta ', app.info.port)
}
main()