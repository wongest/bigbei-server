import Koa from 'koa';

import views from 'koa-views'
import json from 'koa-json'
import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import wxToken from './src/utils/wxToken'
import Router from 'koa-router'
import cors from 'koa-cors';
import Api from './src/routes/index'
import { MONGODB_USERNAME, MONGODB_PASSWORD } from './conf/key.json';

import mongoose from 'mongoose'
// 配置koa-body
import koaBody from 'koa-body';
import https from 'https';
import fs from 'fs';
import path from 'path';

const mongoURI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@116.205.239.86:27017/bigbei`;


const app = new Koa()
app.use(koaBody())

const router = new Router()

// 跨域

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
app.use(async (ctx, next) => {
  const start = Date();
  console.log(`${ctx.method} ${ctx.url} - ${start}`)
  await next()
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e.toString());
    ctx.status = 500;
    ctx.body = { msg: e.toString() }
  }
})

const api = new Api()
api.achieve(router)

app.use(router.routes()).use(router.allowedMethods())


mongoose.connect(mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    console.log('数据库连接')
    // 更新wx token
    wxToken.init()
  })
  .catch(err => {
    console.log(err)
  })

//设置端口
const port = 3032;

const httpsOptions = {
  key: fs.readFileSync(path.relative(__dirname, './certificate/www.bigbei.cn.key')),
  cert: fs.readFileSync(path.relative(__dirname, './certificate/www.bigbei.cn.pem')),
};

//监听端口
https.createServer(httpsOptions, app.callback()).listen(port, () => {
  console.log(`sever start on  ${port}`)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


// module.exports = app
