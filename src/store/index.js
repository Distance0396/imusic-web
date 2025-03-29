import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import musicForm from '@/store/modules/musicform'
import playlist from '@/store/modules/playlist'
import reply from '@/store/modules/reply'
import common from './modules/common'
import comment from '@/store/modules/comment'
import player from '@/store/modules/player'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  getters: {
    token(state) {
      return state.user.token
    },
  },
  mutations: {},
  actions: {},
  modules: {
    user,
    musicForm,
    playlist,
    reply,
    common,
    comment,
    player,
  },
})
