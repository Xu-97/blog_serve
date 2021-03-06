const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const error = require('koa-json-error')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// 引入
const index = require('./routes/index')
const users = require('./routes/users')
const article = require('./routes/article')
const label = require('./routes/label')
const links = require('./routes/links')
const weblog = require('./routes/weblog')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

// 使用koa-json-error进行错误处理
app.use(error({
  postFormat:(e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(article.routes(), article.allowedMethods()) 
app.use(label.routes(), label.allowedMethods())
app.use(links.routes(), links.allowedMethods())
app.use(weblog.routes(), weblog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
