import request from '@/utils/request'

export const getRandomAlbum = () => {
  return request.get('/user/album/random')
}

// 根据专辑id查询信息
export const getAlbumById = (id) => {
  return request.get(`/user/album/${id}`)
}
