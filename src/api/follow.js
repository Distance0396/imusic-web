import request from '@/utils/request'

// 获取用户收藏
export const getUserFollow = () => {
  return request.get('/follow')
}

/**
 * 收藏
 */
export const follow = (objType, objId) => {
  return request.post('/follow', {
    objType: objType,
    objId: objId,
    isDelete: 1
  })
}

/**
 * 取消收藏
 */
export const unfollow = ({ objType, objId, likeTimestamp }) => {
  return request.put('/follow', {
    objType: objType,
    objId: objId,
    likeTimestamp: likeTimestamp
  })
}
