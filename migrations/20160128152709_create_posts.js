'use strict'
exports.up = function (knex, Promise) {
  return knex.schema.createTable('posts', function (table) {
    table.increments()
    table.string('title').notNullable()
    table.text('content').notNullable()
    table.integer('user_id').notNullable()
    table.timestamps()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('games')
}
