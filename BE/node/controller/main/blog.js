'use strict';
const path = require('path');

const ObjectId = require('mongodb').ObjectID,
    DBHelperFind = require(path.join(global.CONFIG.path.modsPath, './db/db.find')),
    DBHelperInsert = require(path.join(global.CONFIG.path.modsPath, './db/db.insert')),
    DBHelperTools = require(path.join(global.CONFIG.path.modsPath, './db/db.tools')),
    redisHelper = require(path.join(global.CONFIG.path.modsPath, './redis')).helper,
    jwt = require(path.join(global.CONFIG.path.modsPath, "jwt"));

const dbFindTimeKey = "dbQueryTime";

const updateArticleViews = function (articleId) {
    let dbInstance = new DBHelperTools({
        poolInstance: global.MONGO_POOL.blog,
        collection: global.CONFIG.db.collection.blogDetail
    });
    dbInstance.updateArticleViews(articleId).always(()=> {
        dbInstance = null;
    })
};

const getArticleDetail = function (dbQuery) {
    return new Promise((resolve, reject)=> {
        let key = `articleDetailId:${dbQuery.articleId}`;
        redisHelper.get(key).then(data=> {
            let result;
            try {
                result = JSON.parse(data);
            } catch (ex) {
                reject(ex);
            }
            delete result[dbFindTimeKey];
            result["poweredBy"] = "redis";
            resolve(result);
        }).catch(err=> {
            if (err) {
                reject(err);
            } else {
                let dbInstance = new DBHelperFind({
                    poolInstance: global.MONGO_POOL.blog,
                    collection: global.CONFIG.db.collection.blogDetail
                });
                dbInstance.findOne(dbQuery).then(result=> {
                    if (result.success) {
                        redisHelper.set(key, JSON.stringify(result), function () {
                            resolve(result);
                        });
                    } else {
                        reject(result);
                    }
                }).catch(err=> {
                    reject(err);
                }).always(()=> {
                    dbInstance = null;
                })
            }
        });
    })
};

const getArticleList = function (dbQuery, options) {
    return new Promise((resolve, reject)=> {
        let key = `articleListId:${dbQuery && dbQuery.tags ? dbQuery.tags : "all"}`;
        redisHelper.get(key).then(data=> {
            let result;
            try {
                result = JSON.parse(data);
            } catch (ex) {
                reject(ex);
            }
            delete result[dbFindTimeKey];
            result["poweredBy"] = "redis";
            resolve(result);
        }).catch(err=> {
            if (err) {
                reject(err);
            }
            let dbInstance = new DBHelperFind({
                poolInstance: global.MONGO_POOL.blog,
                collection: global.CONFIG.db.collection.blogDetail
            }.blogList);
            dbInstance.find(dbQuery, options).then(result=> {
                if (result.success) {
                    redisHelper.set(key, JSON.stringify(result), function () {
                        resolve(result);
                    });
                } else {
                    reject(result);
                }
            }).catch(err=> {
                reject(err);
            }).always(()=> {
                dbInstance = null;
            })
        })
    });
};

const getReply = function (dbQuery, options) {
    let key = `articleReplyId:${dbQuery.articleId}`;
    return new Promise((resolve, reject)=> {
        redisHelper.get(key).then(data=> {
            let result;
            try {
                result = JSON.parse(data);
            } catch (ex) {
                reject(ex);
            }
            delete result[dbFindTimeKey];
            result["poweredBy"] = "redis";
            resolve(result);
        }).catch(err=> {
            if (err) {
                reject(err);
            } else {
                let dbInstance = new DBHelperFind({
                    poolInstance: global.MONGO_POOL.blog,
                    collection: global.CONFIG.db.collection.blogDetail
                }.reply);
                dbInstance.find(dbQuery, options).then(result=> {
                    if (result.success) {
                        redisHelper.set(key, JSON.stringify(result), function () {
                            resolve(result);
                        });
                    } else {
                        reject(result);
                    }
                }).catch(err=> {
                    reject(err);
                }).always(()=> {
                    dbInstance = null;
                })
            }
        })
    });
};

const insertReply = function (data, userId) {
    return new DBHelperInsert({
        poolInstance: global.MONGO_POOL.blog,
        collection: global.CONFIG.db.collection.reply
    }).insertOne({
        "articleDbId": data.articleDbId,
        "articleId": data.articleId,
        "replyTo": data.replyTo,
        "replyUser": {
            "id": jwt.decode.decode(userId),
            "content": data.replyUser.content,
            "name": data.replyUser.name,
            "time": data.replyUser.time,
            "avatar": data.replyUser.avatar
        }
    });
};
module.exports = {
    article: {
        getArticleDetail,
        getArticleList,
        updateArticleViews
    },
    reply: {
        getReply,
        insertReply
    }
};
