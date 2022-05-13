import axios from 'axios';
import { ElMessage } from 'element-plus';
import { lsGet, lsSet } from '.';

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

const instance = axios.create({
  // baseURL: 'https://api.yotei.finance',
  timeout: 50000
});

instance.interceptors.request.use(
  config => {
    // config.url = config.url?.replace('/api', '')
    config.headers = {
      ...config.headers,
      token: lsGet('token', '')
    };
    console.log('request config', config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//
instance.interceptors.response.use(
  response => {
    const data = response.data;
    if (data.token) {
      lsSet('token', data.token);
    }
    console.log('response', data);

    return data;
  },
  error => {
    console.log('error', error);
    ElMessage.error(error.response.data.result || 'error');
    return Promise.reject(error);
  }
);

export default instance;
