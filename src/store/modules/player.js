import { playMusic } from '@/api/music'
export default {
  namespaced: true,
  state() {
    return {
      // 音量
      volume: 100,
      // 总时长
      totalTime: 0,
      // 初始时间
      firstTime: 0,
      // 控制播放
      isPlay: false,
      // 进度条
      sliderValue: 0,
      // 播放状态
      status: false,
      // 当前播放音乐
      currentSong: null,
      // 当前播放的音乐所在
      currentCol: null,
      audio: '',
      lyric: '',
    }
  },
  mutations: {
    setVolume(state, obj) {
      state.volume = obj
    },
    setTotalTime(state, obj) {
      state.totalTime = obj
    },
    setFirstTime(state, obj) {
      state.firstTime = obj
    },
    setIsPlay(state, obj) {
      state.isPlay = obj
    },
    setSliderValue(state, obj) {
      state.sliderValue = obj
    },
    setStatus(state, obj) {
      state.status = obj
    },
    // 修改当前播放音乐
    setCurrentSong(state, song) {
      state.currentSong = song
    },
    // 修改当前播放的音乐所在
    setCurrentCol(state, obj) {
      state.currentCol = obj
    },
    setAudio(state, obj) {
      state.audio = obj
    },
    setLyric(state, obj) {
      state.lyric = obj
    },
  },
  actions: {
    // 修改当前播放音乐
    playSong({ commit }, song) {
      commit('setCurrentSong', song)
    },
    playCol({ commit }, col) {
      commit('setCurrentCol', col)
    },
    async getLyricAndAudio({ commit }, id) {
      const { data } = await playMusic(id)
      commit('setAudio', data.audio)
      commit('setLyric', data.lyric)
    },
  },
  getters: {},
}
