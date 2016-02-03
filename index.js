const koa = require('koa'),
      app = koa()
const knex = require('koa-knex')
const passport = require('koa-passport')
const session = require('koa-generic-session')
const bodyParser = require('koa-bodyparser')
const views = require('koa-render')
const Router = require('koa-router')
const public = new Router()
const users = new Router()
const posts = new Router()


app.proxy = true

app.keys = ['']
app.use(session())

app.use(bodyParser())

require('./auth')
app.use(passport.initialize())
app.use(passport.session())


app.use(views('./views', {
  map: { html: 'handlebars'},
  cache: false
}))

/* Public Area */

public.get('/', function *() {
  this.body = yield this.render('login')
})


public.post('/login',
  passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/'
  })
)

public.get('/logout', function*(next) {
  this.logout()
  this.redirect('/')
})



app.use(public.middleware())

app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
})

users.get('/users', function*(next) {
  this.body = yield this.render('app')
})

posts.get('/:pid', function*(next){
  console.log(this.params.pid)
  this.body = yield this.render('posts')
})

users.use('/users/:uid/posts', posts.routes(), posts.allowedMethods())

app.use(users.middleware())

app.listen(process.env.PORT || 3000)
