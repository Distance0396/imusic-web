import request from '@/utils/request'

/**
 * 搜索
 * @param keyword
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const search = (keyword) => {
  return request.get('/common/search', {
    params: {
      keyword: keyword
    }
  })
}
