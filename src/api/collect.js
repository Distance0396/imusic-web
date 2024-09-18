import request from '@/utils/request'

// 获取用户收藏
export const getUserCollect = () => {
  return request.get('/collect')
}

/**
 * 收藏
 * @param singerId
 * @param albumId
 * @param musicFormId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const collect = (singerId, albumId, musicFormId) => {
  return request.post('/collect', {
    singerId: singerId,
    albumId: albumId,
    musicFormId: musicFormId
  })
}

/**
 * 取消收藏
 * @param singerId
 * @param albumId
 * @param musicFormId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const unfollow = (singerId, albumId, musicFormId) => {
  return request.post('/collect/del', {
    singerId: singerId,
    albumId: albumId,
    musicFormId: musicFormId
  })
}
