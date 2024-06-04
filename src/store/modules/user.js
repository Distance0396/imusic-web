import { setUserInfo, getUserInfo } from '@/utils/storage'
export default {
  namespaced: true,
  state () {
    return {
      userInfo: getUserInfo()
    }
  },
  mutations: {
    setUser (state, obj) {
      state.userInfo = obj
      setUserInfo(obj)
    }
  },
  methods: {

  },
  actions: {
    logout (context) {
      // 用户信息重置
      context.commit('setUser', {})
    }
  },
  getters: {
  }
}
