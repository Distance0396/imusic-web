import request from '@/utils/request'

// 获取用户信息
export const getUser = () => {
  return request.get('/user/user/info')
}

// 登陆
export const login = (landing, reCAPTCHA) => {
  return request.post('/user/user/login', {
    ...landing
  },
  {
    params: {
      reCAPTCHA: reCAPTCHA
    }
  })
}

// 注册
export const register = (user) => {
  return request.post('/user/user/register', {
    ...user
  })
}

export const query = () => {
  return request.get('/user/user/query')
}

/*
  修改用户信息
 */
export const updateUserInfo = (name, email, phone, avatar, sign, tag) => {
  return request.put('/user/user', {
    name, email, phone, avatar, sign, tag
  })
}
