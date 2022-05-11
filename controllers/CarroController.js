const { range } = require("express/lib/request");
const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

module.exports = {

    async index(req, res) {
        try {
            // para obter os carros pode-se utilizar .select().orderBy() ou apenas .orderBy()
            //            const carros = await dbKnex("carros");

            const carros = await dbKnex("carros as c")
                .select("c.id", "modelo", "foto", "ano", "preco",
                    "m.nome as marca", "u.nome as usuario")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .innerJoin('usuarios as u', 'usuario_id', 'u.id')
            res.status(200).json(carros); // retorna statusCode ok e os dados
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    async store(req, res) {
        // faz a desestruturação dos dados recebidos no corpo da requisição
        const { modelo, foto, ano, preco, marca_id, usuario_id } = req.body;

        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!modelo || !foto || !ano || !preco || !marca_id || !usuario_id) {
            res.status(400).json({ msg: "Enviar modelo, foto, ano, preco, marca_id e usuario_id do carro" });
            return;
        }

        // caso ocorra algum erro na inclusão, o programa irá capturar (catch) o erro
        try {
            // insert, faz a inserção na tabela carros (e retorna o id do registro inserido)
            const novo = await dbKnex("carros").insert({ modelo, foto, ano, preco, marca_id, usuario_id });
            res.status(201).json({ id: novo[0] }); // statusCode indica Create
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    },

    async update(req, res) {
        const id = req.params.id;
        const { modelo, foto, ano, preco, marca_id, usuario_id } = req.body;

        // se algum dos campos não foi passado, irá enviar uma mensagem de erro e retornar
        if (!modelo || !foto || !ano || !preco || !marca_id || !usuario_id) {
            res.status(400).json({ msg: "Enviar modelo, foto, ano, preco, marca_id e usuario_id do carro" });
            return;
        }

        try {
            await dbKnex("carros").update({ modelo, foto, ano, preco, marca_id, usuario_id }).where("id", id);
            res.status(200).json();
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    async destroy(req, res) {
        const { id } = req.params;
        try {
            await dbKnex("carros").del().where({ id });
            res.status(200).json();
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    async destaque(req, res) {
        const { id } = req.params;

        let dados;

        try {
            dados = await dbKnex("carros").where({ id });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }

        if (dados[0].destaque) {
            try {
                await dbKnex("carros").update({ destaque: 0 }).where({ id });
                res.status(200).json();
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        } else {
            try {
                await dbKnex("carros").update({ destaque: 1 }).where({ id });
                res.status(200).json();
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        }
    },

    async destaques(req, res) {
        try {
            const carros = await dbKnex("carros as c")
                .select("c.id", "modelo", "foto", "ano", "preco", "destaque",
                    "m.nome as marca", "u.nome as usuario")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .innerJoin('usuarios as u', 'usuario_id', 'u.id')
                .where("destaque", true)

            res.status(200).json(carros);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    async search(req, res) {
        const { palavra } = req.params;
        try {
            const carros = await dbKnex("carros as c")
                .select("c.id", "modelo", "foto", "ano", "preco",
                    "m.nome as marca", "u.nome as usuario")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .innerJoin('usuarios as u', 'usuario_id', 'u.id')
                .where("modelo", "like", `%${palavra}%`)
                .orWhere("marca", "like", `%${palavra}%`)
            res.status(200).json(carros);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    async filter(req, res) {

        let minimo = 0;
        let maximo = 0;

        if (req.body.minimo) {
            minimo = req.body.minimo;
        }

        if (req.body.maximo) {
            maximo = req.body.maximo;
        }

        if (minimo == 0 && maximo == 0) {
            res.status(400).json({ msg: "Enviar preço mínimo e/ou máximo do carro para pesquisa" });
            return;
        }

        let carros;
        if (maximo) {
            try {
                carros = await dbKnex("carros as c")
                    .select("c.id", "modelo", "foto", "ano", "preco", "destaque",
                        "m.nome as marca", "u.nome as usuario")
                    .innerJoin('marcas as m', 'marca_id', 'm.id')
                    .innerJoin('usuarios as u', 'usuario_id', 'u.id')
                    .where("preco", ">=", minimo)
                    .andWhere("preco", "<=", maximo);
            } catch (error) {
                res.status(400).json({ msg: error.message });
                return
            }
        } else {
            try {
                carros = await dbKnex("carros as c")
                    .select("c.id", "modelo", "foto", "ano", "preco", "destaque",
                        "m.nome as marca", "u.nome as usuario")
                    .innerJoin('marcas as m', 'marca_id', 'm.id')
                    .innerJoin('usuarios as u', 'usuario_id', 'u.id')
                    .where("preco", ">=", minimo)
            } catch (error) {
                res.status(400).json({ msg: error.message });
                return
            }
        }
        res.status(200).json(carros);
    },

    async groupMarcas(req, res) {
        try {
            const carros = await dbKnex("carros as c")
                .select("m.nome as marca")
                .count({ num: "c.id" })
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .groupBy("marca");
            res.status(200).json(carros);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    async groupDataCad(req, res) {
        try {
            const carros = await dbKnex("carros")
                .select(dbKnex.raw("strftime('%Y', created_at) as ano"))
                .count({ num: "id" })
                .groupBy("ano");
            res.status(200).json(carros);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    async updateValue(req, res) {

        const taxa = req.params.taxa;

        if (req.params.marca_id) {
            try {
                const marca_id = req.params.marca_id;
                await dbKnex("carros").update({ preco: dbKnex.raw(`preco + (preco * ${taxa / 100})`) }).where({ marca_id })
                res.status(200).json();
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        } else {
            try {
                await dbKnex("carros").update({ preco: dbKnex.raw(`preco + (preco * ${taxa / 100})`) });
                res.status(200).json();
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        }
    },

    async show(req, res) {
        const { id } = req.params;

        try {
            const carros = await dbKnex("carros as c")
                .select("c.id", "modelo", "foto", "ano", "preco",
                    "m.nome as marca", "u.nome as usuario")
                .innerJoin('marcas as m', 'marca_id', 'm.id')
                .innerJoin('usuarios as u', 'usuario_id', 'u.id')
                .where("c.id", id)
            res.status(200).json(carros[0]); // retorna statusCode ok e os dados
        } catch (error) {
            res.status(400).json({ msg: error.message }); // retorna status de erro e msg
        }
    }









}