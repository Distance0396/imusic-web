import request from '@/utils/request'

// 获取用户收藏
export const getUserCollect = (userId) => {
  return request.get(`/user/collect/${userId}`)
}

/**
 * 收藏
 * @param singerId
 * @param albumId
 * @param musicFormId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const collect = (singerId, albumId, musicFormId) => {
  return request.post('/user/collect', {
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
  return request.post('/user/collect/del', {
    singerId: singerId,
    albumId: albumId,
    musicFormId: musicFormId
  })
}
