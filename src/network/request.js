import axios from 'axios'

export function request(config) {
  //创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 10000
  })
  //定义添加请求拦截器
  instance.interceptors.request.use(config => {
    //在发送前做什么
    // console.log(config);

    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
  })
  //return一个实例调用  发送真正的请求
  return instance(config)
}