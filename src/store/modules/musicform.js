import { getMusicFormById } from '@/api/muiscForm'
import Vue from 'vue'
export default {
  namespaced: true,
  state () {
    return {
      // 歌单信息
      musicForm: {},
      // 歌单歌曲
      musicList: []
    }
  },
  mutations: {
    // 歌单 根据歌单id查询歌单详情
    setMusicForm (state, obj) {
      state.musicForm = obj
    },
    // 歌单 歌单中的歌曲
    setMusic (state, obj) {
      state.musicList = obj
    },
    // 歌单
    setMusicFormProperty (state, { property, value }) {
      Vue.set(state.musicForm, property, value)
    }
  },
  actions: {
    // 根据歌单id查询歌单详情
    async getMusicForm (context, id) {
      await getMusicFormById(id).then(res => {
        if (res.data == null) return
        context.commit('setMusicForm', res.data)
        context.commit('setMusic', res.data.musicList)
      })
    },
    // 歌单 修改歌单
    updateMusicFormProperty ({ commit }, payload) {
      commit('setMusicFormProperty', payload)
    }
  },
  getters: {
    /*
      获取指定属性
     */
    getMusicFormProperty: state => property => state.musicForm[property]
  }
}
