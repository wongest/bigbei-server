import Router from "koa-router";
import request from '../../utils/request';
import UserModel from '../../models/user';
import { AppID, AppSecret } from '../../../conf/key.json';

const router = new Router();


/**
 * @description 获取本人的审阅
 */
router.get("/approve", async (ctx) => {
  const request = ctx.request;
  const cookie = request.headers.cookie;
  const user = await
    UserModel.findOne({ openid: cookie });
  if (!user) {
    ctx.status = 401;
  } else {
    
  }
});

/**
 * @description 获取本人的申请
 */
router.get("/apply", async (ctx) => {
  const request = ctx.request;
  const cookie = request.headers.cookie;
  const user = await
    UserModel.findOne({ openid: cookie });
  if (!user) {
    ctx.status = 401;
  } else {
    
  }
});


export default router.routes();