import request from '@/utils/request'

export const getCategory = (key) => {
  return request.get('/category', {
    params: {
      key: key
    }
  })
}
