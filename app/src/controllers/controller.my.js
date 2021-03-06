'use strict'
const fs = require('fs')
const path = require('path')

const { blogCoon } = require('../config/mongo/mongoConfig')
const { mongo: { ObjectId } } = require('mongoose')

const updateArticleRepoTool = require('../lib/lib.tools.updateGithubArtcleRepo')
const redisPrefix = "MY_REDIS_PREFIX"
const resumeCachePath = path.join(__dirname, '../../root/Tom\'sresume.md')

/**
 * 得到简历
 */
exports.getMyResume = async (ctx, next) => {
  const resumeRedisPrefix = `${redisPrefix}-resume`
  let resume = await REDIS.getCache(resumeRedisPrefix)
  if (!resume) {
    resume = fs.readFileSync(resumeCachePath, 'utf8')
    resume = { data: { resume } }
    await  REDIS.setCache(resumeRedisPrefix, resume)
  }
  ctx.body = resume
  next()
}

/**
 * 更新简历
 */
exports.updateMyResume = async (ctx, next) => {
  await REDIS.removeCache(redisPrefix)
  let { resume } = ctx.body
  fs.writeFileSync(resumeCachePath, JSON.stringify({ resume }), 'utf8')
  next()
}

/**
 * 更新repo
 */
exports.pushArticleRepo = async (ctx, next) => {
  try {
    updateArticleRepoTool.push()
    next()
  } catch ( e ) {
    ctx.throw(500, e)
  }
}
