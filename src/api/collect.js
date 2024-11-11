import request from '@/utils/request'

// 获取用户收藏
export const getUserCollect = () => {
  return request.get('/follow')
}

/**
 * 收藏
 */
export const collect = (objType, objId) => {
  return request.post('/follow', {
    objType: objType,
    objId: objId
  })
}

/**
 * 取消收藏
 */
export const unfollow = (objType, objId) => {
  return request.put('/follow', {
    objType: objType,
    objId: objId,
    likeTimestamp: new Date()
  })
}
