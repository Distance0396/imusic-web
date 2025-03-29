import request from '@/utils/request'

export const getArticleById = (id) => {
  return request.get(`/article/${id}`)
}

/**
 * @param content 内容
 * @param title 标题
 * @param category 类型
 * @param status // 1发布 0草稿 2删除
 * @param face // 封面
 */
export const issueArticle = ({ content, title, category, status, face }) => {
  return request.post('/article', {
    content: content,
    title: title,
    category: category,
    status: status,
    face: face
  })
}

export const getArticleByCategoryId = ({ categoryId, sortType, id }) => {
  return request.get('/article', {
    params: {
      categoryId: categoryId,
      sortType: sortType,
      id: id
    }
  })
}
