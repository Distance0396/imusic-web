import { setUserInfo, getUserInfo, setMusicFormList, getMusicFormList } from '@/utils/storage'
import { getCollectForm } from '@/api/user'
export default {
  namespaced: true,
  state () {
    return {
      userInfo: getUserInfo(),
      collectForm: getMusicFormList()
    }
  },
  mutations: {
    setUser (state, obj) {
      state.userInfo = obj
      setUserInfo(obj)
    },
    setCollectForm (state, obj) {
      state.collectForm = obj
      setMusicFormList(obj)
    }
  },
  methods: {

  },
  actions: {
    // 查询用户搜藏信息
    async getCollectForm (context) {
      await getCollectForm().then(res => {
        console.log(res)
        const { data } = res
        context.commit('setCollectForm', data)
      })
    },
    logout (context) {
      // 用户信息重置
      context.commit('setUser', {})
    }
  },
  getters: {
  }
}
