import { query } from '@/api/user'

export default {
  namespaced: true,
  state () {
    return {
      singer: null,
      album: null
    }
  },
  mutations: {
    setSinger (state, obj) {
      state.singer = obj
    },
    setAlbum (state, obj) {
      state.album = obj
    }
  },
  actions: {
    async query ({ commit }) {
      await query().then(res => {
        if (res.data == null) return

        commit('collect/setCollectForm', { ...res.data.collect }, { root: true })
        commit('user/setUserInfo', { ...res.data.user }, { root: true })
        commit('setSinger', res.data.singer)
        commit('setAlbum', res.data.album)
      })
    }
  },
  getters: {

  }
}
