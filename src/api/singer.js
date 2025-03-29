import request from '@/api/request'

export const getSingerList = () => {
  return request.get('/singer/list')
}

export const findSingerById = id => {
  return request.get(`/singer/${id}`)
}

// 获取随机歌手
export const getRandomSinger = () => {
  return request.get('/singer/random')
}
