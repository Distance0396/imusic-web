import Vue from 'vue'
export default {
  namespaced: true,
  state () {
    return {
      reply: {
        content: '',
        rootReplyId: null,
        childReplyId: null,
        userName: ''
      },
      activeReplyId: null
    }
  },
  mutations: {
    setActiveReplyId (state, id) {
      state.activeReplyId = id
    },
    setReply (state, rootState) {
      state.reply = {
        content: '',
        rootReplyId: null,
        childReplyId: null,
        userName: rootState.user.userInfo.name
      }
    },
    setReplyProperty (state, { property, value }) {
      Vue.set(state.reply, property, value)
    }
  },
  actions: {
    setActiveReplyId ({ commit }, id) {
      commit('setActiveReplyId', id)
    },
    clear ({ commit, rootState }) {
      commit('setReply', rootState)
    },
    updateReplyProperty ({ commit, rootState }, reply) {
      // commit('setReply', rootState)
      commit('setReplyProperty', reply)
    }
  },
  getters: {
    getReplyProperty: state => property => state.reply[property]
  }
}
