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

  },
  getters: {

  }
}
