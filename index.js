const koa = require('koa'),
      app = koa()

app.proxy = true

const session = require('koa-generic-session')
app.keys = ['']
app.use(session())

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

require('./auth')
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

const views = require('koa-render')

app.use(views('./views', {
  map: { html: 'handlebars'},
  cache: false
}))

const Router = require('koa-router')

const public = new Router()

public.get('/', function *() {
  this.body = yield this.render('login')
})


public.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
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


const secured = new Router()

secured.get('/app', function *() {
  this.body = yield this.render('app')
})

app.use(secured.middleware())

app.listen(process.env.PORT || 3000)
