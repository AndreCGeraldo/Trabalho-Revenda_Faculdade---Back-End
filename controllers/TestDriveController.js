const { range } = require("express/lib/request");
const dbKnex = require("../data/db_config");  // dados de conexão com o banco de dados

module.exports = {

    // LISTAGEM TEST DRIVRE
    async index(req, res) {
        try {
            const testdrive = await dbKnex("testdrive as t")
                .select("t.id", "nome", "fone", "email", "cpf", "uf", "cidade",
                    "m.modelo as carro", "t.created_at", "t.updated_at")
                .innerJoin('carros as m', 'carro_id', 'm.id')
            res.status(200).json(testdrive);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    // INCLUSÃO TEST DRIVE
    async store(req, res) {
        const { nome, fone, email, cpf, uf, cidade, carro_id } = req.body;

        if (!nome || !fone || !email || !cpf || !uf || !cidade || !carro_id) {
            res.status(400).json({ msg: "Enviar nome, fone, email, cpf, uf, cidade e id do veículo." });
            return;
        }
        try {
            const novo = await dbKnex("testdrive").insert({ nome, fone, email, cpf, uf, cidade, carro_id });
            res.status(201).json({ id: novo[0] });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    // ALTERAÇÃO TEST DRIVE
    async update(req, res) {
        const id = req.params.id;
        const { nome, fone, email, cpf, uf, cidade, carro_id } = req.body;

        if (!nome || !fone || !email || !cpf || !uf || !cidade || !carro_id) {
            res.status(400).json({ msg: "Enviar nome, fone, email, cpf, uf, cidade e id do veículo." });
            return;
        }
        try {
            await dbKnex("testdrive").update({ nome, fone, email, cpf, uf, cidade, carro_id }).where("id", id);
            res.status(200).json();
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    // EXCLUSÃO TEST DRIVE
    async destroy(req, res) {
        const { id } = req.params;
        try {
            await dbKnex("testdrive").del().where({ id });
            res.status(200).json();
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },

    // RESUMO DE QUANTOS TESTDRIVE TEM POR CARRO
    async groupTestNum(req, res) {
        try {
            const testdrive = await dbKnex("testdrive as t")
                .select("m.modelo as carro")
                .count({ Test_Drive: "t.id" })
                .innerJoin('carros as m', 'carro_id', 'm.id')
                .groupBy("carro");
            res.status(200).json(testdrive);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },







}