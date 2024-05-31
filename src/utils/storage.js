const INFO_KEY = 'imusic_user_info'

// 设置用户信息
export const setUserInfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}
// 移除用户信息
export const removeUserInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取用户信息 若没有本地数据就空值
export const getUserInfo = () => {
  const res = localStorage.getItem(INFO_KEY)
  return res
    ? JSON.parse(res)
    : {
        userId: '',
        token: '',
        name: ''
      }
}
