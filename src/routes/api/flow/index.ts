import Router from "koa-router";
import request from '../../../utils/request';
import UserModel from '../../../models/user';
import FlowModel, { FlowType } from '../../../models/flow';
import { v4 as uuidv4 } from 'uuid';
import { setUserInFlowList } from './utils';
import cryptoJs from 'crypto-js';
import { CRYPTO_SECRET_KET } from '../../../../conf/key.json';

const router = new Router();

/**
 * @description 获取本人的审阅
 */
router.get("/approve", async (ctx) => {
  const request = ctx.request;
  const openid = cryptoJs.AES.decrypt(request.headers.cookie, CRYPTO_SECRET_KET).toString(cryptoJs.enc.Utf8);
  const user = await UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const list = await FlowModel.find({ reviewerId: user.id });
    ctx.body = await setUserInFlowList(list);
    ctx.status = 200;
  }
});

/**
 * @description 获取本人的申请
 */
router.get("/apply", async (ctx) => {
  const request = ctx.request;
  const openid = cryptoJs.AES.decrypt(request.headers.cookie, CRYPTO_SECRET_KET).toString(cryptoJs.enc.Utf8);
  const user = await UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const list = await FlowModel.find({ createrId: user.id })
    ctx.body = await setUserInFlowList(list);
    ctx.status = 200;
  }
});

/**
 * @description 获取某个申请详情
 */
router.get("/review/:id", async (ctx) => {
  const id = ctx.params.id;

  const data = await FlowModel.findOne({ id }, '-_id');
  if (data) {
    ctx.body = data;
    ctx.status = 200;
  } else {
    ctx.body = { msg: '未找到申请' };
    ctx.status = 404;
  }
});

/**
 * @description 审批
 */
router.post("/review/:id", async (ctx) => {
  const request = ctx.request;
  const requestData = request.body;
  const openid = cryptoJs.AES.decrypt(request.headers.cookie, CRYPTO_SECRET_KET).toString(cryptoJs.enc.Utf8);
  const user = await UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const { approved, reason, rate } = requestData;
    if (!approved || !reason || !rate) {
      ctx.body = { msg: '参数错误' };
      ctx.status = 500;
    }
    const id = ctx.params.id;
    const newData = await FlowModel.updateOne({ id }, {
      reviewTime: String(new Date()),
      approved,
      reason,
      rate,
    });
    ctx.status = 200;
    ctx.body = newData;
  }
});

/**
 * @description 提交申请
 */
router.post("/apply", async (ctx) => {
  const request = ctx.request;
  const requestData = ctx.request.body;
  const openid = cryptoJs.AES.decrypt(request.headers.cookie, CRYPTO_SECRET_KET).toString(cryptoJs.enc.Utf8);
  const { phoneNumber, title, description } = requestData;
  const user = await UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    if (!phoneNumber || !title || !description) {
      ctx.body = { msg: '参数错误' };
      ctx.status = 500;
      return;
    }
    const reviewer = await UserModel.findOne({ phoneNumber });
    if (!reviewer) {
      ctx.body = { msg: '未找到审阅者' };
      ctx.status = 404;
      return;
    }
    const data: FlowType = {
      id: uuidv4(),
      createrId: user.id,
      reviewerId: reviewer.id,
      title,
      description,
      createTime: String(new Date()),
    }
    const newFlow = new FlowModel(data);
    await newFlow.save();
    ctx.body = data;
    ctx.status = 200;
  }
});

/**
 * @description 删除我的审批
 */
router.delete("/apply/:id", async (ctx) => {
  const request = ctx.request;
  const openid = cryptoJs.AES.decrypt(request.headers.cookie, CRYPTO_SECRET_KET).toString(cryptoJs.enc.Utf8);
  const user = await UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const id = ctx.params.id;
    await FlowModel.deleteOne({ id });
    ctx.status = 200;
    ctx.body = { msg: 'success' };
  }
});


export default router.routes();