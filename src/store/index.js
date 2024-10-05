import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import musicForm from '@/store/modules/musicform'
import playlist from '@/store/modules/playlist'
import collect from '@/store/modules/collect'
import reply from '@/store/modules/reply'
import common from './modules/common'
import comment from '@/store/modules/comment'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  getters: {
    token (state) {
      return state.user.token.token
    }
  },
  mutations: {},
  actions: {},
  modules: {
    user, musicForm, playlist, collect, reply, common, comment
  }
})
