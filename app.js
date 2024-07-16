const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// const mongoose = require('mongoose')
// 配置koa-body
const koaBody = require('koa-body');
app.use(koaBody())
const Router = require('koa-router')
const router = new Router()

// 跨域
const cors = require('koa-cors');
app.use(cors({
  origin: function (ctx) {
    return "*"; // 允许来自所有域名请求
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

// 静态文件
app.use(require('koa-range'))
app.use(require('koa-static')(__dirname + '/public'))

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

const Api = require('./src/routes/index')
const api = new Api()
api.achieve(router)

app.use(router.routes()).use(router.allowedMethods())

// mongoose.connect(mongoURI,
//   { useNewUrlParser: true, useUnifiedTopology: true }
// )
//   .then(() => {
//     console.log('数据库连接')
//   })
//   .catch(err => {
//     console.log(err)
//   })

//设置端口
const port = 3032;

//监听端口
app.listen(port, () => {
  console.log(`sever start on  ${port}`)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// module.exports = app
