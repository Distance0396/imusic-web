import { query } from '@/api/user'

export default {
  namespaced: true,
  state () {
    return {
      singer: null,
      album: null,
      browse: null,
      asideWidth: 250
      // isBerth: false
    }
  },
  mutations: {
    setSinger (state, obj) {
      state.singer = obj
    },
    setAlbum (state, obj) {
      state.album = obj
    },
    setBrowse (state, obj) {
      state.browse = obj
    },
    setAsideWidth (state, obj) {
      state.asideWidth = obj
    }
  },
  actions: {
    async query ({ commit }) {
      await query().then(res => {
        if (res.data == null) return

        commit('collect/setCollectForm', { ...res.data.collect }, { root: true })
        commit('user/setUserInfo', { ...res.data.user }, { root: true })
        commit('user/setSettings', { ...res.data.user.settings }, { root: true })
        commit('setSinger', res.data.singer)
        commit('setAlbum', res.data.album)
        commit('setBrowse', res.data.browse)
      })
    }
  },
  getters: {
    isBerth (state) {
      return state.asideWidth <= 120
    }
  }
}
