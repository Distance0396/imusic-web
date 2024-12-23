import request from '@/utils/request'

export const getDailyRecommend = (id) => {
  return request.get('/recommend', {
    params: {
      objType: id
    }
  })
}
