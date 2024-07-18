import Router from "koa-router";
import request from '../../utils/request';
import UserModel from '../../models/user';
import { AppID, AppSecret } from '../../../conf/key.json';

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

router.get("/", async (ctx) => {
  const request = ctx.request;
  const cookie = request.headers.cookie;
  const user = await
    UserModel.findOne({ openid: cookie });
  if (!user) {
    ctx.status = 401;
  } else {
    ctx.status = 200;
    ctx.body = user;
  }
});

router.post("/openid/wx", async (ctx) => {
  const { body } = ctx.request;
  const { code } = body;
  const params = {
    appid: AppID,
    secret: AppSecret,
    js_code: code,
    grant_type: 'authorization_code',
  }
  try {
    const { data } = await request.get('https://api.weixin.qq.com/sns/jscode2session', { params })
    const { openid } = data;
    const user = await UserModel.findOne({ openid });
    ctx.status = 200;
    ctx.body = {
      ...data,
      auth: !!user,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});

router.post("/create", async (ctx) => {
  const { body } = ctx.request;
  const { openid, remark, phoneNumber } = body;
  if (!openid || !remark || !remark) {
    ctx.body = { msg: '缺少参数' };
    ctx.status = 500;
    return;
  }
  const user = await UserModel.findOne({ openid });
  if (user) {
    ctx.status = 500;
    ctx.body = { msg: '用户已存在' };
    return;
  }
  const data = {
    openid,
    remark,
    phoneNumber,
    createTime: new Date(),
  }
  const newUser = new UserModel(data)
  await newUser.save();
  ctx.status = 200;
  ctx.body = data;
});










export default router.routes();