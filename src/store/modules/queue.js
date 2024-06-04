export default {
  namespaced: true,
  state () {
    return {
      // 音乐队列
      queue: []
    }
  },
  mutations: {
    setQueue (state, obj) {
      state.queue = obj
    }
  },
  methods: {

  },
  actions: {

  },
  getters: {

  }
}
