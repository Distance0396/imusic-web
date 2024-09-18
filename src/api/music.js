import request from '@/utils/request'

/**
 * 通过id查询歌词
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getLyric = (id) => {
  return request.get('/music/lyric', {
    params: {
      id: id
    }
  })
}
