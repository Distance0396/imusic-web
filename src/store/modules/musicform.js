import { getMusicFormById } from '@/api/muiscForm'
import { getMusicFormList } from '@/utils/storage'
export default {
  namespaced: true,
  state () {
    return {
      // 用户歌单
      musicFormList: getMusicFormList(),
      // 歌单信息
      musicForm: {},
      // 歌单歌曲
      musicList: []
    }
  },
  mutations: {
    // 查询用户的歌单
    // setMusicFormList (state, obj) {
    //   state.musicFormList = obj
    //   setMusicFormList(obj)
    // },
    // 根据歌单id查询歌单详情
    setMusicForm (state, obj) {
      state.musicForm = obj
    },
    // 歌单中的歌曲
    setMusic (state, obj) {
      state.musicList = obj
    }
  },
  actions: {
    // 查询用户的歌单
    // async getMusicFormList (context) {
    //   await getMusicFormByUserId().then(res => {
    //     const { data } = res
    //     context.commit('setMusicFormList', data)
    //   })
    // },
    // 根据歌单id查询歌单详情
    async getMusicForm (context, id) {
      await getMusicFormById(id).then(res => {
        context.commit('setMusicForm', res.data)
        context.commit('setMusic', res.data.musicList)
      })
    }
  },
  getters: {

  }
}
