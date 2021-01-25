docker ps
docker exec -it 23b64a3f58ba mongo -u erivan5 -p erivan5 --authenticationDatabase herois

//mostra todos bancos 
show dbs
// Mudando o contexto para uma database
use herois
// Mostrar tabelas(colletions) 
show colletions
// INSERT um objeto na tabela database
db.herois.insert({
    nome: 'Flash 26',
    poder: 'velocidade',
    dataNascimento: '1998-01-01'
})
// Para listar tabela
db.herois.find()
// Para listar tabela formatada 
db.herois.find().pretty()
// Usando javaScript no banco com
for (let i = 0; i <= 1000; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'velocidade',
        dataNascimento: '1998-01-01'
    })
}
//Para ver quantidade te ITEM que tem na tabela
db.herois.count()

db.herois.findOne()
//Pequisar objeto por odem nome { "_id" : ObjectId("5fb6c2afe5f98578de00f301"), "nome" : "Clone-984", "poder" : "velocidade", "dataNascimento" : "1998-01-01" } de 0 a 100
db.herois.find().limit(100).sort({nome: -1})
//Para pesquisar um valor especifico { "poder" : "velocidade" } Todos os PODERES sem ID
db.herois.find({}, {poder: 1, _id: 0})
//==========================================

// CREATE
db.herois.insert({
    nome: 'Flash2',
    poder: 'velocidade2',
    dataNascimento: '1998-01-01'
})
//READ
db.herois.find()
db.herois.find({nome: 'HOMEM DE FERRO 2'}) // listar por nome 
db.herois.find({_id: ObjectId("5fb6baec7bb3b58525541a95")})// listar por id 
//UPDATE
db.herois.update({_id: ObjectId("5fb6baec7bb3b58525541a95")},{nome: 'HOMEM DE FERRO'})
// MELHOR FORMA DE FAZER UM UPDATE
db.herois.update({_id: ObjectId("5fb6c2aee5f98578de00ef39")},{$set:{ nome: 'HOMEM DE FERRO 2'}}) 
db.herois.update({poder: 'velocidade2'},{$set:{poder: 'Super Força'}})
// DELETE
db.herois.remove({}) // remover TODA a base
db.herois.remove({"nome" : "Flash2"}) // remover por nome
db.herois.remove({"poder" : "velocidade"}) // remover por pode 

// é a ORM

npm install mongoose