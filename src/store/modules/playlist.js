export default {
  namespaced: true,
  state () {
    return {
      // 音乐队列
      playlist: []
    }
  },
  mutations: {
    // 清空播放队列 添加新的播放队列
    setPlayList (state, obj) {
      state.playlist = []
      state.playlist.push(...obj)
    },
    // 加入播放队列最后
    pushPlayList (state, obj) {
      state.playlist.push(...obj)
    },
    // 加入播放队列开始
    unshiftPlayList (state, obj) {
      state.playlist.unshift(obj)
    },
    // 下一首
    nextSong (state) {
      if (state.playlist.length > 0) {
        state.playlist.push(state.playlist.splice(0, 1)[0])
      }
    },
    // 上一首
    lastSong (state) {
      if (state.playlist.length > 0) {
        state.playlist.unshift(state.playlist.splice(-1, 1)[0])
      }
    },
    // 指定歌曲
    appoint (state, song) {
      const index = state.playlist.findIndex(music => music.id === song.id)
      if (index === -1) {
        // 没有查找到就添加至playList最前面
        this.unshiftPlayList(song)
      }
      // 指定歌曲前的歌曲都移至数组最后
      state.playlist.push(...state.playlist.splice(0, index))
    }
  },
  actions: {

  },
  getters: {
    // 获取第一个播放对象
    firstPlayList (state) {
      return state.playlist[0]
    }
  }
}
