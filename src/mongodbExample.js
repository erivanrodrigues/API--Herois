//npm install mongoose
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://erivan5:erivan5@localhost:27017/herois', {
    useNewUrlParser: true
}, function (error) {
    if (!error) return
    console.log('Falha na conexão! ', error)
});

const connection = Mongoose.connection

// TIPOS DE function em JAVASCRIPT
/*
    function nomeDaFuncao(){  }
    const minhaFuncao = function(){   }
    const minhaFuncaoArrow = () => {} // para Varios paramentros
    const minhaFuncaoArrow = (parametros) => console.log(parametros) // para um unico parametro 
 */
//Abrir conexão
connection.once('open', () => console.log('Database rodando!!'))
//setTimeout(() => {
//    const state = connection.readyState
//    console.log('state ', state)
//}, 1000)
/*
    0: Disconectado
    1: Conectado
    2: conectando
    3:Disconectaando
*/
const heroisSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})
const model = new Mongoose.model('heroi', heroisSchema)

async function main() {
    const resultCadastrar = await model.create({
        nome: 'Thor',
        poder: 'Rompe Tormenta'
    })
    console.log('Result cadastrar ', resultCadastrar)
    const listItens = await model.find()
    console.log('Itens ', listItens)
}
main()