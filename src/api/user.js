import request from '@/utils/request'

// 获取用户信息
export const getUserInfo = () => {
  return request.get('/user/info')
}

// 登陆
export const login = (landing) => {
  return request.post('/user/login', {
    ...landing
  })
}

// 注册
export const register = (user) => {
  return request.post('/user/register', {
    ...user
  })
}

// 获取用户收藏
export const getCollectForm = () => {
  return request.get('/user/collectForm')
}
