import Request from '@/utils/request'

/**
 * 根据用户id查询所属歌单
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getMusicFormByUserId = () => {
  return Request.get('/music-form/user')
}

/**
 * 根据歌单id查询歌单
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getMusicFormById = (id) => {
  return Request.get(`/music-form/${id}`)
}
