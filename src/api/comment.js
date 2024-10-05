import request from '@/utils/request'

export const select = (dto) => {
  return request.get('/comment', {
    params: {
      ...dto
    }
  })
}

export const saveComment = (dto, content) => {
  return request.post('/comment', {
    ...dto, content
  })
}

export const moreComment = (dto) => {
  return request.get('/comment/more', {
    params: {
      ...dto
    }
  })
}
