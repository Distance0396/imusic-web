import { query } from '@/api/user'

export default {
  namespaced: true,
  state() {
    return {
      singer: null,
      album: null,
      browse: null,
      asideWidth: 250,
      x: 0,
      y: 0,
      focusUser: null,
      isFocus: false,
      isShowRightBox: false,
      // isBerth: false
    }
  },
  mutations: {
    setIsFocus(state, obj) {
      state.isFocus = obj
    },
    setFocus(state, { userInfo, x, y }) {
      state.focusUser = userInfo
      state.x = x
      state.y = y
    },
    setSinger(state, obj) {
      state.singer = obj
    },
    setAlbum(state, obj) {
      state.album = obj
    },
    setBrowse(state, obj) {
      state.browse = obj
    },
    setAsideWidth(state, obj) {
      state.asideWidth = obj
    },
  },
  actions: {
    async query({ commit }) {
      await query().then(res => {
        if (res.data == null) return
        // commit('follow/setCollectForm', { ...res.data.follow }, { root: true })
        commit('setSinger', res.data.singer)
        commit('setAlbum', res.data.album)
        commit('setBrowse', res.data.browse)
      })
    },
  },
  getters: {
    getX(state) {
      return state.x
    },
    getY(state) {
      return state.y
    },
    getFocusUser(state) {
      return state.focusUser
    },
    getIsFocus(state) {
      return state.isFocus
    },
    isBerth(state) {
      return state.asideWidth <= 120
    },
  },
}
