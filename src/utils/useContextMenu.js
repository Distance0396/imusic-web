import { appendMusicForm, deleteMusic } from '@/api/muiscForm'

export function useContextMenu (menu, musicItem, params) {
  console.log(menu)
  if (menu.id) {
    appendMusicForm(menu.id, musicItem.id).then(r => null)
  }
  switch (menu) {
    case '删除':
      // 删除歌单歌曲
      // console.log(route)
      deleteMusic(params, musicItem.id).then(r => null)
      break
    case '加入队列':
      // 添加歌曲至队列
      break
    case '跳转至歌手':
      // 根据歌曲跳转至歌手
      break
  }
}
