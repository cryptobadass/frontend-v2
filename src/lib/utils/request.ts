import axios from 'axios';
import { lsGet, lsSet } from '.';

const request = axios.create({
  baseURL: 'https://api.yotei.finance',
  timeout: 50000
});

request.interceptors.request.use(
  config => {
    // 设置以 form 表单的形式提交参数，如果以 JSON 的形式提交表单，可忽略
    if (config.method === 'post') {
      // JSON 转换为 FormData
      const formData = new FormData();
      Object.keys(config.data).forEach(key =>
        formData.append(key, config.data[key])
      );
      config.data = formData;
    }
    console.log('aaa', config.url);
    config.url = config.url?.replace('/api', '');
    // config.headers.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJyZXdhcmRzIiwiaWF0IjoxNjUyMjg3Mjg0LCJleHAiOjE2NTIyOTA4ODR9.f18XaGd8k0MpPEin9CHM84cCLtvDmgCg4UU4R4VMeM0"
    console.log('aaa', lsGet('token'));
    if (lsGet('token')) {
      config.headers.token = lsGet('token');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
request.interceptors.response.use(
  res => {
    //对响应数据做些事  todo  返回拦截未生效
    console.log('aaaa nnn', res);
    if (res.data.token) {
      console.log('aaa token:', res.data.token);
      lsSet('token', res.data.token);
    }
    if (!res.data.success) {
      // alert(res.error_msg)
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    if (error.response.status === 401) {
      // location.href = '/login';
    } else if (error.response.status === 500) {
      // 服务器错误
      // do something
      return Promise.reject(error.response.data);
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data);
  }
);

export default request;
