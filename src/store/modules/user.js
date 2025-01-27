import { setToken, getToken, getMusicFormList, setMusicFormList } from '@/utils/storage'
import { getUser, getUserAndSetting } from '@/api/user'
import { getUserFollow } from '@/api/follow'
import Vue from 'vue'
export default {
  namespaced: true,
  state () {
    return {
      // 带token
      token: getToken(),
      // 收藏夹
      userFollow: getMusicFormList(),
      // 用户信息
      userInfo: {
        id: null,
        name: '',
        account: '',
        phone: '',
        avatar: '',
        email: '',
        sex: '',
        createTime: ''
      },
      // 用户设置
      settings: {
        id: null,
        userId: null,
        language: '',
        privacyLevel: '',
        quality: '',
        emailInform: '',
        createTime: '',
        updateTime: ''
      }
    }
  },
  mutations: {
    // 修改用户信息
    setToken (state, obj) {
      setToken(obj)
      // state.token = obj
    },
    // 修改用户信息
    setUserInfo (state, obj) {
      state.userInfo = obj
    },
    setProperty (state, { property, value }) {
      Vue.set(state.userInfo, property, value)
    },
    setSettings (state, obj) {
      state.settings = obj
    },
    // 修改用户收藏信息
    setCollectForm (state, obj) {
      state.userFollow = obj
      // 将用户收藏信息存至会话
      setMusicFormList(obj)
    }
  },
  actions: {
    // 获取用户信息
    async getUser ({ context }, payload) {
      const { data } = await getUser(payload)
      context.commit('setUserInfo', data)
    },
    // 退出登录
    logout (context) {
      // 用户信息重置
      context.commit('setUser', {})
      context.commit('setUserInfo', {})
    },
    updateProperty ({ commit }, payload) {
      commit('setProperty', payload)
    },
    // 获取用户个人信息 收藏和设置数据
    async getUserAndSetting ({ commit, dispatch }, payload) {
      const { data: { userInfo, userSetting } } = await getUserAndSetting(payload)
      commit('setUserInfo', userInfo)
      commit('setSettings', userSetting)
      await dispatch('getCollectForm')
    },
    // 查询用户搜藏
    async getCollectForm ({ commit }) {
      await getUserFollow().then(res => {
        if (res.data == null) return
        const { data } = res
        commit('setCollectForm', data)
      })
    }
  },
  getters: {
    getProperty: state => property => state.userInfo[property],
    // 返回收藏夹歌单
    getUserMusicForm (state) {
      return state.userFollow.musicFormList
    },
    // 判断歌手是否收藏
    isSingerCollect (state) {
      return (id) => {
        return state.userFollow.singerList.find(singer => singer.id === id)
      }
    },
    // 判断专辑是否收藏
    isAlbumCollect (state) {
      return (id) => {
        return state.userFollow.albumList.find(album => album.id === id)
      }
    },
    // 判断歌单是否收藏
    isMusicFormCollect (state) {
      return (id) => {
        return state.userFollow.musicFormList.find(musicForm => musicForm.id === id)
      }
    }
  }
}
