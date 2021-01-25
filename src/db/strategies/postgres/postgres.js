const ICrud = require('./../interfaces/InterfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema

    }
    async isConnected() {
        try {
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.log('FALHA! ', error)
            return false;
        }
    }
    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        // Para sincronizar o banco 
        await model.sync()
        return model
    }
    async create(item) {
        const {
            dataValues
        } = await this._schema.create(item)
        //console.log('CREATE', dataValues)
        return dataValues

    }
    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        return this._schema[fn](item, {
            where: {
                id
            }
        })
        return result
    }

    async delete(id) {
        const query = id ? {
            id
        } : {}
        return this._schema.destroy({
            where: query
        })
    }

    async read(item = {}) {
        //console.log('LISTA', item)
        return this._schema.findAll({
            where: item,
            raw: true
        })
    }
    static async connect() {
        const sequelize = new Sequelize(process.env.POSTGRES_URL, {
            quoteIdentifiers: false,
            operatiorsAliases: false,
            logging: false,
            ssl: process.env.SSL_DB,
            dialectOptions: {
                ssl: process.env.SSL_DB
            }
        })
        return sequelize
    }
}
module.exports = Postgres