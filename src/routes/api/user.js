const Router = require("koa-router");
const request = require('../../utils/request');

const router = new Router();


/**
 * @route GET /api/user/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */

router.get("/test", async (ctx) => {
  ctx.status = 200;
  ctx.body = { msg: "router works....." };
});

module.exports = router.routes();