import request from '@/utils/request'

/**
 * 获取音乐评论
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getReplyMusicById = (id) => {
  return request.get(`/reply/music/${id}`)
}

/**
 * 查找专辑评论
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getReplyAlbumById = (id) => {
  return request.get(`/reply/album/${id}`)
}

/**
 * 查找歌单评论
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const findPlaylistReplyById = (id) => {
  return request.get(`/reply/playlist/${id}`)
}

/**
 * 查找歌手评论
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const findSingerReplyById = (id) => {
  return request.get(`/reply/singer/${id}`)
}

/**
 * 添加评论
 * @param reply
 * @param musicId
 * @param albumId
 * @param singerId
 * @param playListId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const insert = (reply, musicId, albumId, singerId, playListId) => {
  return request.post('/reply', {
    ...reply,
    musicId: musicId,
    singerId: singerId,
    playListId: playListId,
    albumId: albumId
  })
}
