import { getMusicFormById, getMusicFormByUserId } from '@/api/muiscForm'
import { setMusicFormList, getMusicFormList } from '@/utils/storage'
export default {
  namespaced: true,
  state () {
    return {
      musicFormList: getMusicFormList(),
      musicForm: {}
    }
  },
  mutations: {
    // 查询用户的歌单
    setMusicFormList (state, obj) {
      state.musicFormList = obj
      setMusicFormList(obj)
    },
    // 根据歌单id查询歌单详情
    setMusicForm (state, obj) {
      state.musicForm = obj
    }
  },
  actions: {
    async getMusicFormList (context) {
      await getMusicFormByUserId().then(res => {
        const { data: { musicFormList } } = res
        context.commit('setMusicFormList', musicFormList)
      })
    },
    async getMusicForm (context, id) {
      await getMusicFormById(id).then(res => {
        context.commit('setMusicForm', res.data)
      })
    }
  },
  getters: {

  }
}
