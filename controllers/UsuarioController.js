const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

const saltRounds = 10;

module.exports = {
    async index(req, res) {
        try {
            // para obter os usuarios pode-se utilizar .select().orderBy() ou apenas .orderBy()
            const usuarios = await dbKnex("usuarios");
            res.status(200).json(usuarios); // retorna statusCode ok e os dados
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },


    async store(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { nome, email, senha } = req.body;
        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!nome || !email || !senha) {
            res.status(400).json({ msg: "Enviar nome, email e senha do usuario" });
            return;
        }

        // verifica se o e-mail já está cadastrado
        try {
            const dados = await dbKnex("usuarios").where({ email });
            if (dados.length) {
                res.status(400).json({ erro: "E-mail já cadastrado" });
                return;
            }
        } catch (error) {
            res.status(400).json({ erro: error.message });
            return;
        }


        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(senha, salt);

        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela usuarios (e retorna o id do registro inserido)
            const novo = await dbKnex("usuarios").insert({ nome, email, senha: hash });
            res.status(201).json({ id: novo[0] }); // statusCode indica Create
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },


    async login(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { email, senha } = req.body;
        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!email || !senha) {
            //res.status(400).json({ msg: "Enviar email e senha do usuario" });
            res.status(400).json({ msg: "Login/Senha incorretos..." });
            return;
        }
        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // consulta o e-mail no banco de dados
            const dados = await dbKnex("usuarios").where({ email });
            // se não encontrou...
            if (dados.length == 0) {
                //res.status(400).json({ msg: "E-mail não cadastrado..." }); // retorna status de erro e msg
                res.status(400).json({ msg: "Login/Senha incorretos..." }); // retorna status de erro e msg
                return;
            }
            // se existe, compara a senha informada com a senha cadastrada no banco
            if (bcrypt.compareSync(senha, dados[0].senha)) {

                const token = jwt.sign({
                    usuario_id: dados[0].id,
                    usuario_nome: dados[0].nome
                },
                    process.env.JWT_KEY,
                    { expiresIn: "1h" }
                );
                res.status(200).json({ token, usuario_id: dados[0].id, usuario_nome: dados[0].nome })

            } else {
                //res.status(400).json({ msg: "Senha Incorreta..." }); // retorna status de erro e msg
                res.status(400).json({ msg: "Login/Senha incorretos..." }); // retorna status de erro e msg
            }
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    async senhas(req, res) {
        res.status(200).json({ senhas: "123OK" })
    }


}