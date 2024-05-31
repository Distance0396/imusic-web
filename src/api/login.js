import request from '@/utils/request'

// 登陆
export const login = (landing) => {
  return request.post('/user/login', {
    ...landing
  })
}

// 注册
export const register = (user) => {
  console.log(user)
  return request.post('/user/register', {
    ...user
  })
}
