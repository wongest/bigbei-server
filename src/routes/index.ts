import user from './api/user'
import flow from './api/flow';


const Api = function() {}

Api.prototype.achieve = (router) => {
  router.use('/api/user', user);
  router.use('/api/flow', flow);
}

export default Api;