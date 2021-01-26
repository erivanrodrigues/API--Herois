
const Mongoose = require('mongoose')
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
//mocha workaround
module.exports = Mongoose.model('heroi', heroisSchema)
//module.exports = Mongoose.models.heroi || Mongoose.model('heroi', heroisSchema)