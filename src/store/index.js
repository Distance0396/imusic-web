import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import music from '@/store/modules/musicForm'
import queue from '@/store/modules/queue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {
    token (state) {
      return state.user.userInfo.token
    },
    userName (state) {
      return state.user.userInfo.name
    },
    musicFormList (state) {
      return state.music.musicFormList
    }
  },
  mutations: {},
  actions: {},
  modules: {
    user, music, queue
  }
})
