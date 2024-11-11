import request from '@/utils/request'

/**
 * 通过id查询歌曲
 */
export const getMusic = (id) => {
  return request.get('/music/main', {
    params: {
      id: id
    }
  })
}
