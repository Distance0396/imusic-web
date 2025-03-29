import request from '@/api/request'

export const select = dto => {
  return request.get('/comment', {
    params: {
      ...dto,
    },
  })
}

export const saveComment = dto => {
  return request.post('/comment', {
    ...dto,
  })
}

export const moreComment = dto => {
  return request.get('/comment/more', {
    params: {
      ...dto,
    },
  })
}
