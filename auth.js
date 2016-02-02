const dbName = 'sessionator_development'

const knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    port     : '5432',
    database : dbName
  },
  searchPath: 'public'
})
const passport = require('koa-passport')
const user = { id: 1, username: 'test' }


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, user)
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy((username, password, done) => {
  knex.raw('select * from users where username = ?', [username]).then(function(resp) {
    if (!resp.rows[0]) {
      done(null, false)
    }
    else if (username === resp.rows[0].username && password === resp.rows[0].password) {
      done(null , user)
    } else {
      done(null, false)
    }
  })
}))
