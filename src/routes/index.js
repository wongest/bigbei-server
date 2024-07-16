require('module-alias/register')

const koaBody = require('koa-body');

const user = require('../routes/api/user')


const Api = function() {}

Api.prototype.achieve = (router) => {
  router.use('/api/user', user);
}

module.exports = Api;