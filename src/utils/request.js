import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { removeToken } from '@/utils/storage'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

/**
 * 响应拦截器
 */
request.interceptors.response.use((response) => {
  const { data } = response

  if (data.code === 200) {
    return data
  }
  if (data.code === 401) {
    Notification.error({
      title: 'token失效',
      message: '请重新登陆',
      showClose: false
    })
    router.push('/login').then(r => removeToken())
    return Promise.reject(data.msg)
  }

  if (data.code !== 200) {
    Notification.error({
      title: '错误',
      message: data.msg,
      showClose: false
    })
    return Promise.reject(data.msg)
  }
}, (error) => {
  router.push('/404')
  // .then(r => removeToken())
  return Promise.reject(error)
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = store.getters.token
  if (token) {
    config.headers.token = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default request
