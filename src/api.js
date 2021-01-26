//npm i hapi
// npm i vision inert hapi-swagger
// npm i hapi-auth-jwt2
// npm i dotenv

const {
    config
} = require('dotenv')
const {
    join
} = require('path')
const {
    ok
} = require('assert')

console.log('PASSOU AQUI!!!!!!!!!!!!!!!!!')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "a env é invalida, ou dev ou prod")

//__DIRNAME e o diretorio para pegar a configuração de qualquer lugar 
const configPath = join(__dirname, './config', `.env.${env}`)

config({
    path: configPath
})

const Hapi = require('hapi') // Importando o HAPI
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoude = require('./routes/authRoutes')

const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')


const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = process.env.JWT_KEY


//Inicializar o HAPI
const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, method) {
    return method.map(method => instance[method]())
}

async function main() {
    // Preparando as conexão
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioSchema))



    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        },
        //leng: 'pt'
    }
    //para registrar modulo e se comunicarem entre ser
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions

        }
    ])
    // Estrategia de autenticação 
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        //options: {
        //    expiresIn: 20
        //},
        validate: async (dado, request) => {
            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase()
            })
            if (!result) {
                return {
                    isValid: false
                }
            }
            //Verificar no banco se o usuario continua ativo
            //Verificar no banco se o usuario pagando

            return {
                isValid: true // caso não valido false
            }
        }
    })
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.method()),
        ...mapRoutes(new AuthRoude(JWT_SECRET, contextPostgres), AuthRoude.method())
    ])


    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)
    return app
}
module.exports = main()