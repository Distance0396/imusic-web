import Request from '@/utils/request'

/**
 * 根据歌单id查询歌单
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getMusicFormById = (id) => {
  return Request.get(`/music-form/${id}`)
}

/**
 * 添加歌单
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addMusicForm = () => {
  return Request.post('/music-form/save')
}

/**
 * 添加歌曲至歌单
 * @param musicId
 * @param musicFormId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const appendMusicForm = (musicFormId, musicId) => {
  return Request.post('/music-form', {
    musicFormId: musicFormId,
    musicId: musicId
  })
}

/**
 * 删除歌单歌曲
 * @param musicFormId
 * @param musicId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteMusic = (musicFormId, musicId) => {
  return Request.delete('/music-form', {
    data: {
      musicFormId: musicFormId,
      musicId: musicId
    }
  })
}

export const updateMusicForm = (musicForm) => {
  return Request.put('/music-form', {
    id: musicForm.id,
    name: musicForm.name,
    image: musicForm.image,
    description: musicForm.description
  })
}
