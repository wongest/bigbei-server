import UserModel from '../../../models/user';
import FlowModel from '../../../models/flow';

export const setUserInFlowList = async (list) => {
  const cacheCreaters: any[] = [];
    const cacheReviewers: any[] = [];
  for (let item of list) {
    if (!cacheCreaters.some(({ openid }) => item.createrId === openid)) {
      const creater = await UserModel.findOne({ openid: item.createrId });
      cacheCreaters.push(creater);
    }
    if (!cacheReviewers.some(({ openid }) => item.reviewerId === openid)) {
      const creater = await UserModel.findOne({ openid: item.reviewerId });
      cacheReviewers.push(creater);
    }
  }
  return list.map(item => {
    const creater = cacheCreaters.find(({ openid }) => item.createrId === openid);
    const reviewer = cacheReviewers.find(({ openid }) => item.reviewerId === openid);
    return {
      ...item,
      creater,
      reviewer,
    }
  });
}