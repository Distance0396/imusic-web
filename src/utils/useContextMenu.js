import { appendMusicForm, deleteMusic } from '@/api/muiscForm'
import store from '@/store/index'
import router from '@/router'
/**
 * 右键菜单
 * @param menu 菜单项
 * @param target 音乐目标
 * @param params 参数1 歌单id
 */
export const useContextMenu = async ({ menu, target, playList }) => {
  switch (menu.label) {
    case '加入歌单':
      await appendMusicForm(playList, target.id)
      break
    case '删除':
      await deleteMusic(playList, target.id)
      break
    case '加入队列':
      // 添加歌曲至队列
      store.commit('playlist/pushPlayList', [target])
      break
    case '跳转至歌手':
      // 根据歌曲跳转至歌手
      router.push(`/singer/${target.singerId}`)
      break
  }
}
