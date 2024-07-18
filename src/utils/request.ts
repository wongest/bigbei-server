import axios from "axios";

const request = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  withCredentials: true, // 跨域请求时是否需要使用凭证
  timeout: 30000, // 请求超时时间
});

// 错误处理函数
function errorHandle(response) {
  switch (response.status) {
    case 400:
      // 处理错误信息，例如抛出错误信息提示，或者跳转页面等处理方式。
      // return Promise.resolve(error)
      break;
    case 401:
      //
      break;
    case 404:
      //
      break;
    // ...
    default:
      throw new Error(response.data);
  }
}
// 成功处理函数

function successHandle(response) {
  return response;
}
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 错误抛到业务代码
    error.data = {};
    error.data.msg = "服务器异常";
    return Promise.resolve(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return successHandle(response);
  },
  (err) => {
    return errorHandle(err);
  }
);

export default request;


