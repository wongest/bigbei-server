import user from '../routes/api/user'


const Api = function() {}

Api.prototype.achieve = (router) => {
  router.use('/api/user', user);
}

export default Api;