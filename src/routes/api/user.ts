import Router from "koa-router";
import cryptoJs from 'crypto-js';
import request from '../../utils/request';
import UserModel, { UserType } from '../../models/user';
import { AppID, AppSecret, CRYPTO_SECRET_KET } from '../../../conf/key.json';
import { v4 as uuidv4 } from 'uuid';
import { omit } from 'lodash';

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

const getOpenidByCode = async (code) => {
  const params = {
    appid: AppID,
    secret: AppSecret,
    js_code: code,
    grant_type: 'authorization_code',
  }
  const { data } = await request.get('https://api.weixin.qq.com/sns/jscode2session', { params })
  const { openid } = data;
  return openid;

}

router.post("/create", async (ctx) => {
  try {
    const { body } = ctx.request;
    const { remark, phoneNumber, code } = body;
    if (!remark || !phoneNumber || !code) {
      ctx.body = { msg: '缺少参数' };
      ctx.status = 500;
      return;
    }
    const openid = await getOpenidByCode(code);
    const user = await UserModel.findOne({ openid });
    if (user) {
      ctx.status = 500;
      ctx.body = { msg: '用户已存在' };
      return;
    }
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
    ctx.body = {
      ...omit(data, ['openid']),
      token: cryptoJs.AES.encrypt(openid, CRYPTO_SECRET_KET).toString(),
    };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { err };
  }
});

router.post("/login", async (ctx) => {
  const { body } = ctx.request;
  const { code } = body;
  if (!code) {
    ctx.body = { msg: '缺少参数' };
    ctx.status = 500;
    return;
  }
  const openid = await getOpenidByCode(code);
  const user = await UserModel.findOne({ openid }, '-openid -_id');
  if (!user) {
    ctx.status = 404;
    ctx.body = { msg: '请注册', code: -1 };
    return;
  }
  try {
    ctx.status = 200;
    ctx.body = {
      ...user,
      token: cryptoJs.AES.encrypt(openid, CRYPTO_SECRET_KET).toString(),
    };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { err };
  }
});


export default router.routes();