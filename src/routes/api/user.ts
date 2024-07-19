import Router from "koa-router";
import cryptoJs from 'crypto-js';
import request from '../../utils/request';
import UserModel, { UserType } from '../../models/user';
import { AppID, AppSecret, CRYPTO_SECRET_KET } from '../../../conf/key.json';
import { v4 as uuidv4 } from 'uuid';

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
  const openid = cryptoJs.AES.decrypt(cookie, CRYPTO_SECRET_KET).toString(cryptoJs.enc.Utf8);
  const user = await
    UserModel.findOne({ openid }, '-openid -_id');
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
  try {
    const data: UserType = {
      id: uuidv4(),
      openid,
      remark,
      phoneNumber,
      createTime: String(new Date()),
    }
    const newUser = new UserModel(data)
    await newUser.save();
    ctx.status = 200;
    ctx.body = data;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { err };
  }

});

export default router.routes();