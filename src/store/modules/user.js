import { setToken, getToken } from '@/utils/storage'
import { getUser } from '@/api/user'
export default {
  namespaced: true,
  state () {
    return {
      // 带token
      token: getToken(),
      userInfo: {}
    }
  },
  mutations: {
    // 修改用户信息
    setToken (state, obj) {
      state.token = obj
      setToken(obj)
    },
    // 修改用户信息
    setUserInfo (state, obj) {
      state.userInfo = obj
    }
  },
  actions: {
    // 获取用户信息
    async getUser (context) {
      await getUser().then(res => {
        context.commit('setUserInfo', res.data)
      })
    },
    // 退出登录
    logout (context) {
      // 用户信息重置
      context.commit('setUser', {})
      context.commit('setUserInfo', {})
    }
  },
  getters: {
  }
}
