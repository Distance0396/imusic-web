import request from '@/api/request'

export const likeApi = dto => {
  return request.post('/support', {
    ...dto,
  })
}
export const unlikeApi = dto => {
  return request.post('/support/unlike', {
    ...dto,
  })
}
