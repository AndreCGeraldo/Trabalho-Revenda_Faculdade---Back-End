exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('testdrive').del()
  await knex('testdrive').insert([
    { nome: 'João Carlos', fone: '984569780', email: 'joaocarlos@gmail.com', cpf: '04056987800', uf: 'RS', cidade: 'Pelotas', carro_id: 1},
    { nome: 'Ana Silveira', fone: '9997088040', email: 'anasilveira@gmail.com', cpf: '78945612311', uf: 'RS', cidade: 'Rio Grande', carro_id: 2 },
    { nome: 'Antonio Nunes', fone: '991506090', email: 'antonionunes@hotmail.com', cpf: '90870845177', uf: 'SC', cidade: 'Florianópolis', carro_id: 3 },
    { nome: 'Norbeto Rocha', fone: '981407080', email: 'norbetorocha@hotmail.com', cpf: '78952814790', uf: 'RS', cidade: 'Passo Fundo', carro_id: 1 },
  ]);
};
