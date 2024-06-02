import request from '@/utils/request'

// 获取用户信息
export const getUser = () => {
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

// 根据id查询简单用户
export const getSimpleUserById = (id) => {
  return request.get('/user', {
    params: {
      id: id
    }
  })
}
