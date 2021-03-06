'use strict';
const errorHandler = require('koa-error')
const path = require('path')
const { indexController } = require('../controllers')

module.exports = (app) => {

  /**
   * global catch server error format
   */
  if (APP.env === 'development') {
    app.use(errorHandler())
  } else {
    app.use(require('../middlewares/middlewares.form.error.handler.js')())
  }

  /**
   * koa-static
   * docker container /home/blog-stable/static
   */
  app.use(require('koa-static')(path.resolve(__dirname, '../../../../static/'), { maxage: 360000 }))

  /**
   * restful API server routers
   */
  const { restfulAPI } = global.APP

  const prefix = '/' + restfulAPI.apiPrefix + '/' + restfulAPI.apiVersion

  /**
   * Apply all router server
   */
  app.use(require('./index.route')(prefix).routes())
  app.use(require('./blog.article.route')(prefix).routes())
  app.use(require('./blog.list.route')(prefix).routes())
  app.use(require('./front.route')(prefix).routes())
  app.use(require('./auth.route')(prefix).routes())
  app.use(require('./my.route')(prefix).routes())
  app.use(require('./tools.route')(prefix).routes())
  app.use(require('./webpush.route')(prefix).routes())

  /**
   * final middleware
   */
  app.use(async ctx => {

    if (ctx.status === 404) {

      ctx.status = 200

      if (ctx.url.indexOf('api') === -1) {
        ctx.body = await indexController.getIndexView(ctx)
      } else {
        ctx.body = {
          status: 404,
          result: {
            msg: 'sorry ,API document doesn\'t found'
          }
        }
      }
    }
  })
}
