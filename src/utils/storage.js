const IMUSIC_INFO_KEY = 'imusic_token'

// 设置token
export const setToken = (info) => {
  localStorage.setItem(IMUSIC_INFO_KEY, JSON.stringify(info))
}
// 移除token
export const removeToken = () => {
  localStorage.removeItem(IMUSIC_INFO_KEY)
}
// 获取token 若没有本地数据就空值
export const getToken = () => {
  const res = localStorage.getItem(IMUSIC_INFO_KEY)
  return res
    ? JSON.parse(res)
    : {
        token: null
      }
}

// 会话存储歌单
const IMUSIC_FORM_LIST = 'imusic_collect'
export const setMusicFormList = (musicForm) => {
  sessionStorage.setItem(IMUSIC_FORM_LIST, JSON.stringify(musicForm))
}
export const getMusicFormList = () => {
  const res = sessionStorage.getItem(IMUSIC_FORM_LIST)
  return res
    ? JSON.parse(res)
    : {
        albumList: [],
        singerList: [],
        musicFormList: []
      }
}

export const removeMusicFormList = () => {
  sessionStorage.removeItem(IMUSIC_FORM_LIST)
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
