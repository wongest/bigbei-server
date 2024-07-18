import { AppID, AppSecret } from '../../conf/key.json';
import request from './request';
import TokenModel from '../models/wx_token';

const DEFAULT_EXPRESS_TIME = 7200;

interface TokenInfo {
  access_token: string;
  createTime: number;
  expires_in: number;
}

class WXToken {
  tokenInfo: TokenInfo;
  // 调用api获取token
  requestToken() {
    const params = {
      grant_type: 'client_credential',
      appid: AppID,
      secret: AppSecret
    }
    return request.get('https://api.weixin.qq.com/cgi-bin/token', { params }).then(({ data }) => data)
  }

  // 数据库中拿最新token
  async getToken() {
    const tokenList = await TokenModel.find();
    const latestToken = tokenList.slice().sort((a, b) => b.time - a.time)[0];
    return latestToken;
  }

  get token() {
    return this.tokenInfo?.access_token;
  }

  // 校验token是否过期
  validToken = () => {
    if (!this.tokenInfo) return false;
    const { createTime, expires_in } = this.tokenInfo || {};
    if (Date.now() / 1000 - createTime > expires_in) {
      return false;
    }
    return true;
  }

  undate = async () => {
    if (!this.validToken()) {
      const data = await this.requestToken();
      const tokenInfo = { ...data, createTime: Date.now() / 1000 };
      this.tokenInfo = tokenInfo;
      // 先删除旧数据
      await TokenModel.deleteMany();
      const newTokenModel = new TokenModel(tokenInfo);
      //存储到数据库里面
      await newTokenModel.save();
    }
    setTimeout(() => {
      this.undate();
    }, DEFAULT_EXPRESS_TIME);
  }

  async init() {
    this.tokenInfo = await this.getToken();
    this.undate();
  }
}

export default new WXToken();