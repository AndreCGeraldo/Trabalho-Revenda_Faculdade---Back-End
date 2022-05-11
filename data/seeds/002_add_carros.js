exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('carros').del()
  await knex('carros').insert([
    { id: 1, modelo: 'Sandero', foto: "https://quatrorodas.abril.com.br/wp-content/uploads/2022/01/DSCF0335.jpg", ano: "2019", preco: 49500, marca_id: 3, usuario_id: 1 },
    { id: 2, modelo: 'Prisma', foto: "https://images.noticiasautomotivas.com.br/img/f/chevrolet-onix-prisma-2017-NA-84.jpg", ano: "2018", preco: 75000, marca_id: 1, usuario_id: 2 },
    { id: 3, modelo: 'Palio', foto: "https://www.autoo.com.br/fotos/2016/3/960_720/Pfire_22032016_1777_960_720.jpg", ano: "2017", preco: 32800, marca_id: 4, usuario_id: 1 },
  ]);
};
