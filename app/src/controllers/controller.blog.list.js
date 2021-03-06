'use strict'
const { blogCoon } = require('../config/mongo/mongoConfig')

const blogArticleDetailCoon = blogCoon.model('blogArticleDetail')
const redisPrefix = "BLOG_LIST_REDIS_PREFIX"


exports.getArticleList = async (ctx, next) => {
  let { limit, page, tag } = ctx.query

  limit = Number(limit)
  page = Number(page)

  if (!isNaN(limit) || !isNaN(page)) {

    const key = `${redisPrefix}:articleList?page=${page}&limit=${limit}${tag ? `tag=${tag}` : ''}`

    let list = await REDIS.getCache(key)

    if (list) {
      ctx.state.APICached = true
    } else {
      const select = ["articleId", "title", "tags", "subTitle", "intro", "meta", "_id"]

      const query = tag ? { 'tags': { $in: [tag] } } : {}
      const count = await blogArticleDetailCoon.count(query)
      const data = await blogArticleDetailCoon.find(query)
        .skip(limit * (page - 1)).limit(limit)
        .select(select.join(" ")).lean().exec()

      if (data) {
        list = { data, count, limit, page }
        await REDIS.setCache(key, list)
      } else {
        list = null
      }
    }

    ctx.body = list
    next()
  } else {
    ctx.throw(400, `API query current limit:${ctx.query.limit} and current page:${ctx.query.page} must both provide as Number`, 400)
  }
}
