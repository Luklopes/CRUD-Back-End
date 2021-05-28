/**
 * Arquivo: cliente.js
 * Author: Lucas Lopes 
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Cliente'
 * Data: 25/05/2021
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Cliente:
 * CPF, Nome, Email, Telefone
 * 
 * -> Id: int
 * -> Nome: String
 * -> CPF: Number
 * -> Email : String
 * -> Telefone : Number
 * 
 */

var ClienteSchema = new Schema({
    //id é incluso automaticamente
    nome: String,
    cpf: Number,
    email: String,
    telefone: Number
});
// Exporta o module
module.exports = mongoose.model('Cliente', ClienteSchema);