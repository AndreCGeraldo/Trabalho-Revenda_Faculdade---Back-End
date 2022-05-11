exports.up = function (knex) {
    return knex.schema.createTable("testdrive", (table) => {
        table.increments();
        table.string("nome", 80).notNullable();
        table.string("fone", 20).notNullable();
        table.string("email", 80).unique().notNullable();
        table.string("cpf", 12).notNullable();
        table.string("uf", 2).notNullable();
        table.string("cidade", 40).notNullable();

        table.integer("carro_id").notNullable().unsigned();
        table.foreign("carro_id").references("carros.id")
            .onDelete("restrict").onUpdate("cascade");

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("testdrive");
};