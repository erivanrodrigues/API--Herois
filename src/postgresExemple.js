// npm install sequelize    //é a ORM      // npm install pg-hstore pg   // drive do banco de dados
const Sequelize = require('sequelize')
const driver = new Sequelize(
    'heroes',
    'erivan',
    'erivan1', {
        host: 'localhost',
        dialect: 'postgres',
        /*port: 1234,
        pool: {
            max: 5,
            min: 0,
            idle: 20000,
        },
        dialectOptions: {
            ssl: true,
        },*/
        quoteIdentifiers: false,
        operatiorsAliases: false
    }
)
//Como a tabela vai se comportar 
async function main() {
    try {
        const Herois = driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        })
        // Para sincronizar o banco 
        await Herois.sync()
        await Herois.create({  // para criar um herois
            nome: 'lanterna Verde',
            poder: 'anel Verde'
        })
        

        const result = await Herois.findAll({
            raw: true, // para trazer tudo 
            //attributes: ['nome'] // para trzer um atributo definido 
        })
        console.log('result', result)

    } catch (error) {
        console.error('error', error)
    }
}
main()