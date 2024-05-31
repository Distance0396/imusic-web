import request from '@/utils/request'

export const getRandomAlbum = () => {
  return request.get('/album/random')
}

// 根据歌手id查询专辑
export const getAlbumBySingerId = (id) => {
  return request.get('/album', {
    params: {
      singerId: id
    }
  })
}

// 根据专辑id查询信息
export const getAlbumById = (id) => {
  return request.get(`/album/${id}`)
}
