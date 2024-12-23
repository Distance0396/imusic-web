import { setToken, getToken } from '@/utils/storage'
import { getUser, getUserAndSetting } from '@/api/user'
import Vue from 'vue'
export default {
  namespaced: true,
  state () {
    return {
      // 带token
      token: getToken(),
      userInfo: {
        id: null,
        name: '',
        account: '',
        phone: '',
        avatar: '',
        email: '',
        sex: '',
        createTime: ''
      },
      settings: {
        id: null,
        userId: null,
        language: '',
        privacyLevel: '',
        quality: '',
        emailInform: '',
        createTime: '',
        updateTime: ''
      }
    }
  },
  mutations: {
    // 修改用户信息
    setToken (state, obj) {
      setToken(obj)
      // state.token = obj
    },
    // 修改用户信息
    setUserInfo (state, obj) {
      state.userInfo = obj
    },
    setProperty (state, { property, value }) {
      Vue.set(state.userInfo, property, value)
    },
    setSettings (state, obj) {
      state.settings = obj
    }
  },
  actions: {
    // 获取用户信息
    async getUser ({ context }, payload) {
      const { data } = await getUser(payload)
      context.commit('setUserInfo', data)
    },
    // 退出登录
    logout (context) {
      // 用户信息重置
      context.commit('setUser', {})
      context.commit('setUserInfo', {})
    },
    updateProperty ({ commit }, payload) {
      commit('setProperty', payload)
    },
    // 获取用户个人信息和设置数据
    async getUserAndSetting ({ commit }, payload) {
      const { data: { userInfo, userSetting } } = await getUserAndSetting(payload)
      commit('setUserInfo', userInfo)
      commit('setSettings', userSetting)
    }
  },
  getters: {
    getProperty: state => property => state.userInfo[property]
  }
}
