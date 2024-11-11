import { getUserCollect } from '@/api/collect'
import { getMusicFormList, setMusicFormList } from '@/utils/storage'
export default {
  namespaced: true,
  state () {
    return {
      // 收藏夹
      collect: getMusicFormList()
    }
  },
  mutations: {
    // 修改用户收藏信息
    setCollectForm (state, obj) {
      state.collect = obj
      // 将用户收藏信息存至会话
      setMusicFormList(obj)
    }
  },
  actions: {
    // 查询用户搜藏
    async getCollectForm ({ commit }) {
      await getUserCollect().then(res => {
        if (res.data == null) return
        const { data } = res
        commit('setCollectForm', data)
      })
    }
  },
  getters: {
    // 返回收藏夹歌单
    getUserMusicForm (state) {
      return state.collect.musicFormList
    },
    // 判断歌手是否收藏
    isSingerCollect (state) {
      return (id) => {
        return state.collect.singerList.find(singer => singer.id === id)
      }
    },
    // 判断专辑是否收藏
    isAlbumCollect (state) {
      return (id) => {
        return state.collect.albumList.find(album => album.id === id)
      }
    },
    // 判断歌单是否收藏
    isMusicFormCollect (state) {
      return (id) => {
        return state.collect.musicFormList.find(musicForm => musicForm.id === id)
      }
    }
  }
}
