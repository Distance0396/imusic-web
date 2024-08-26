import request from '@/utils/request'

export const getSingerList = () => {
  return request.get('/user/singer/list')
}

export const findSingerById = (id) => {
  return request.get(`/user/singer/${id}`)
}

// 获取随机歌手
export const getRandomSinger = () => {
  return request.get('/user/singer/random')
}
