import request from '@/api/request'

export const getCategory = key => {
  return request.get('/category', {
    params: {
      key: key,
    },
  })
}
