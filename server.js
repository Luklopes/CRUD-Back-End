/**
 * 
 * Arquivo: server.js
 * Descrição: Api Crud
 * Author: Lucas Lopes
 * Data de Criação: 25/05/2021
 * 
 */

// Configurar o Setup da App:

//Chamadas dos pacotes:
var expressLayouts = require('express-ejs-layouts') ;// new
var port = process.env.PORT || 5000 ;
var express = require('express');
var app = express();// sempre é importante criar essa variável
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Cliente = require('./app/models/cliente');
app.use(cors());
//Configuração mongoBD
mongoose.Promise = global.Promise;

//URI: MLab
mongoose.connect('mongodb+srv://lucaslopes:XYrQswz2oighgsbX@node-crude-api.jnmzq.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

//Maneira Local: MongoDb:
//27017 é a porta padrão do mongo
/*mongoose.connect('mongodb://localhost:27017/node-crud-api', {
    useMongoClient: true
});*/

//Configuração da variável app para usar o 'bodyParser()': para poder retorna os dados atraves de um json
app.use(bodyParser.urlencoded({ extended: true })); //.use é uma propriedade q lida com rotas , isso é padrão, envia os dados em forma de query string
//Estaremos retornando dados a partir de um json e atraves d eum post.
app.use(bodyParser.json());

//Definindo a porta onde será executada a nossa api:
var port = process.env.port || 8000;

//Rotas da nossa API:
//=============================================================================

//Criando uma instância das Rotas via Express:
//Router vai pega todas as instancias das rotas do express
//Usei a docuemntação do express.js para utiliza-lo
var router = express.Router();

//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Middleware para usar em todos os requests enviados para a nossa API- Mensagem Padrão:
router.use(function (req, res, next) {
    console.log('Algo está acontecendo aqui....');
    next(); //aqui é para sinalizar de que prosseguiremos para a próxima rota. E que não irá parar por aqui!!!
});

//Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api): 
router.get('/', function (req, res) {
    res.json({ message: 'Beleza! Bem vindo(a) a nossa A escola Educacional' })
});

//API's:
//==============================================================================

//Rotas que terminarem com '/clientes' (servir: GET ALL & POST)
router.route('/clientes')

    /* 1) Método: Criar cliente (acessar em: POST http://localhost:8000/api/clientes)  */
    .post(function (req, res) {
        var cliente = new Cliente();

        //Aqui vamos setar os campos do cliente (via request):
        cliente.nome = req.body.nome;
        cliente.cpf = req.body.cpf;
        cliente.email = req.body.email;
        cliente.telefone = req.body.telefone;

        cliente.save(function (error) {
            //maneira simples de tratar o error mas podemos tratar diretamente o status da requisição.
            if (error)
                res.send('Erro ao tentar salvar o cliente....: ' + error);

            res.json({ message: 'Cliente Cadastrado com Sucesso!' });
        });
    })
    /* 2) Método: Selecionar Todos clientes (acessar em: GET http://localhost:8000/api/clientes)  */
    .get(function (req, res) {
        Cliente.find(function (error, clientes) {
            if (error)
                res.send('Erro ao tentar Selecionar Todos os clientes...: ' + error);

            res.json(clientes);
        });
    });


//Rotas que irão terminar em '/clientes/:cliente_id' (servir tanto para: GET, PUT & DELETE: id):
router.route('/clientes/:cliente_id')

    /* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/clientes/:cliente_id) */
    .get(function (req, res) {

        //Função para poder Selecionar um determinado cliente por ID - irá verificar se caso não encontrar
        //cliente pelo id... retorna uma mensagem de error:
        Cliente.findById(req.params.cliente_id, function (error, cliente) {
            if (error)
                res.send('Id do cliente não encontrado....: ' + error);

            res.json(cliente);
        });
    });
/* 4) Método: Atualizar por Id: (acessar em: PUT http://localhost:8000/api/clientes/:cliente_id) */
router.route('/clientes/:cliente_id')
    .put(function (req, res) {

        //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'cliente':
        Cliente.findById(req.params.cliente_id, function (error, cliente) {
            if (error)
                res.send("Id do cliente não encontrado....: " + error);

            //Segundo: 
            cliente.nome = req.body.nome;
            cliente.cpf = req.body.cpf;
            cliente.email = req.body.email;
            cliente.telefone = req.body.telefone;

            //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
            cliente.save(function (error) {
                if (error)
                    res.send('Erro ao atualizar o cliente....: ' + error);

                res.json({ message: 'cliente atualizado com sucesso!' });
            });
        });

    });

router.route('/clientes/:cliente_id')
    /* 5) Método: Excluir por Id (acessar: http://localhost:8000/api/clientes/:cliente_id) */
    .delete(function (req, res) {

        Cliente.remove({
            _id: req.params.cliente_id
        }, function (error) {
            if (error)
                res.send("Id do cliente não encontrado....: " + error);

            res.json({ message: 'Cliente Excluído com Sucesso!' });
        });
    });




//Iniciando a Aplicação (servidor):
//é um node http. server, estaremos chamando a porta que criamos
app.listen(port);
console.log("Iniciando a app na porta " + port);
