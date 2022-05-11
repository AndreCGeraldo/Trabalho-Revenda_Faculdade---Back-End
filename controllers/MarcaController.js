const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

module.exports = {

    async index(req, res) {
        try {
            // para obter os marcas pode-se utilizar .select().orderBy() ou apenas .orderBy()
            const marcas = await dbKnex("marcas");
            res.status(200).json(marcas); // retorna statusCode ok e os dados
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    async store(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { nome } = req.body;

        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!nome) {
            res.status(400).json({ msg: "Enviar nome da marca" });
            return;
        }

        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela marcas (e retorna o id do registro inserido)
            const novo = await dbKnex("marcas").insert({ nome });
            res.status(201).json({ id: novo[0] }); // statusCode indica Create
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

}