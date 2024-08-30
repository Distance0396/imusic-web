import { setToken, getToken } from '@/utils/storage'
import { getUser } from '@/api/user'
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
      }
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
    },
    setProperty (state, { property, value }) {
      Vue.set(state.userInfo, property, value)
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
    },
    updateProperty ({ commit }, payload) {
      commit('setProperty', payload)
    }
  },
  getters: {
    getProperty: state => property => state.userInfo[property]
  }
}
