import UserModel from '../../../models/user';

export const setUserInFlowList = async (list) => {
  const cacheUsers: any[] = [];
  for (let item of list) {
    if (!cacheUsers.some(({ id }) => item.createrId === id)) {
      const user = await UserModel.findOne({ id: item.createrId }, '-openid -_id');
      cacheUsers.push(user);
    }
    if (!cacheUsers.some(({ id }) => item.reviewerId === id)) {
      const creater = await UserModel.findOne({ id: item.reviewerId }, '-openid -_id');
      cacheUsers.push(creater);
    }
  }
  return list.map(item => {
    const creater = cacheUsers.find(({ id }) => item.createrId === id);
    const reviewer = cacheUsers.find(({ id }) => item.reviewerId === id);
    return {
      ...item._doc,
      creater,
      reviewer,
    }
  });
}