import Router from "koa-router";
import request from '../../../utils/request';
import UserModel from '../../../models/user';
import FlowModel, { FlowType } from '../../../models/flow';
import { uuidv4 } from 'uuid';
import { setUserInFlowList } from './utils';

const router = new Router();


/**
 * @description 获取本人的审阅
 */
router.get("/approve", async (ctx) => {
  const request = ctx.request;
  const openid = request.headers.cookie;
  const user = await
    UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const list = await FlowModel.find({ reviewerId: openid });
    ctx.body = await setUserInFlowList(list);
    ctx.status = 200;
  }
});

/**
 * @description 获取本人的申请
 */
router.get("/apply", async (ctx) => {
  const request = ctx.request;
  const openid = request.headers.cookie;
  const user = await UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const list = await FlowModel.find({ createrId: openid })
    ctx.body = await setUserInFlowList(list);
    ctx.status = 200;
  }
});

/**
 * @description 审批
 */
router.post("/review:id", async (ctx) => {
  const request = ctx.request;
  const requestData = request.data;
  const openid = request.headers.cookie;
  const user = await
    UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    const id = ctx.params.id;
    const newData = await FlowModel.updateOne({ id }, {
      reviewTime: String(new Date()),
      approved: requestData.approved,
      reason: requestData.reason,
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
  const requestData = request.data;
  const openid = request.headers.cookie;
  const { phoneNumber, title, description } = requestData;
  const user = await
    UserModel.findOne({ openid });
  if (!user) {
    ctx.status = 401;
  } else {
    if (!phoneNumber || !title || !description) {
      ctx.status = 500;
      ctx.body = { msg: '参数错误' };
      return;
    }
    const reviewer = await UserModel.findOne({ phoneNumber });
    const data: FlowType = {
      id: uuidv4(),
      createrId: openid,
      reviewerId: reviewer.openid,
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


export default router.routes();