import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

/**
 * 响应拦截器
 */
request.interceptors.response.use((response) => {
  const res = response.data
  if (res.code !== 200) {
    Notification.error({
      title: '错误',
      message: res.msg,
      showClose: false
    })
    return Promise.reject(res.msg)
  } else {
    Notification.close()
  }
  return res
}, (error) => {
  console.log('响应错误')
  return Promise.reject(error)
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = store.getters.token
  if (token) {
    config.headers.token = token
  }
  // console.log('请求拦截器' + config + config.data)
  return config
}, function (error) {
  // 对请求错误做些什么
  console.log('请求失败')
  return Promise.reject(error)
})
export default request
