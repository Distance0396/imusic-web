import request from '@/utils/request'

// 获取用户信息
export const getUser = (id) => {
  return request.get('/user', {
    params: {
      id
    }
  })
}

// 登陆
export const login = (landing, reCAPTCHA) => {
  return request.post('/user/login', {
    ...landing
  }, {
    params: {
      reCAPTCHA: reCAPTCHA
    }
  })
}

// 注册
export const register = (user) => {
  return request.post('/user/register', {
    ...user
  })
}

export const query = () => {
  return request.get('/user/query')
}

/*
  修改用户信息
 */
export const updateUserInfo = (name, email, phone, avatar, sign, tag, password) => {
  return request.put('/user', {
    name, email, phone, avatar, sign, tag, password
  })
}

/*
  获取code码
 */
export const getCodeApi = (sign, reCAPTCHA) => {
  return request.post('/user/email', {
    ...sign
  }, {
    params: {
      reCAPTCHA: reCAPTCHA
    }
  })
}

/*
 * 搜索
 */
export const search = (keyword) => {
  return request.get('/user/search', {
    params: {
      keyword: keyword
    }
  })
}

/*
 * 修改设置
 */
export const updateSettings = (settings) => {
  return request.put('/user/settings', {
    ...settings
  })
}
