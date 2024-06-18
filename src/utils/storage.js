const IMUSIC_INFO_KEY = 'imusic_user_info'

// 设置用户信息
export const setUserInfo = (info) => {
  localStorage.setItem(IMUSIC_INFO_KEY, JSON.stringify(info))
}
// 移除用户信息
export const removeUserInfo = () => {
  localStorage.removeItem(IMUSIC_INFO_KEY)
}
// 获取用户信息 若没有本地数据就空值
export const getUserInfo = () => {
  const res = localStorage.getItem(IMUSIC_INFO_KEY)
  return res
    ? JSON.parse(res)
    : {
        userId: '',
        token: '',
        name: ''
      }
}

// 会话存储歌单
const IMUSIC_FORM_LIST = 'imusic_form_list'
export const setMusicFormList = (musicForm) => {
  sessionStorage.setItem(IMUSIC_FORM_LIST, JSON.stringify(musicForm))
}
export const getMusicFormList = () => {
  const res = sessionStorage.getItem(IMUSIC_FORM_LIST)
  return res
    ? JSON.parse(res)
    : []
}

// 搜索历史
const IMUSIC_SEARCH_HISTORY = 'imusic_search_history'
export const setSearchHistory = (info) => {
  localStorage.setItem(IMUSIC_SEARCH_HISTORY, JSON.stringify(info))
}
export const getSearchHistory = () => {
  const res = localStorage.getItem(IMUSIC_SEARCH_HISTORY)
  return res !== null
    ? JSON.parse(res)
    : []
}
