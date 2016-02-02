exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').del(),
    knex('users').insert({
        username: 'airrobb',
        password: 'bubba'
      }),
      knex('users').insert({
        username: 'nilu',
        password: 'pokemon'
      }),
      knex('users').insert({
        username: 'irene',
        password: 'bubba'
      })
   )
}
