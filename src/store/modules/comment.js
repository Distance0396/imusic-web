import Vue from 'vue'
export default {
  namespaced: true,
  state () {
    return {
      content: '',
      rootId: 0,
      parent: 0,
      replyUserId: null,
      actionUserName: null
    }
  },
  mutations: {
    setRootId (state, id) {
      state.rootId = id
    },
    setContent (state, payload) {
      state.content = payload
    },
    setParent (state, payload) {
      state.parent = payload
    },
    setActionUserId (state, payload) {
      state.replyUserId = payload
    },
    setActionUserName (state, payload) {
      state.actionUserName = payload
    },
    setCommentProperty (state, { property, value }) {
      Vue.set(state, property, value)
    }
  },
  actions: {
    clear ({ commit }) {
      commit('setContent', '')
      commit('setActionUserId', null)
      commit('setRootId', 0)
      commit('setParent', 0)
      commit('setActionUserName', null)
    },
    updateCommentProperty ({ commit, rootState }, payload) {
      commit('setCommentProperty', payload)
    }
  },
  getters: {
    getCommentProperty: state => property => state[property]
  }
}
