import request from '@/api/request'

export const getDailyRecommend = id => {
  return request.get('/recommend', {
    params: {
      objType: id,
    },
  })
}
