'use strict';

import {BlogApi} from '../api';
import {RouterBlog, Header} from '../actions/typs';
// import Notification from '../component/Notification'
// import Spinner from '../component/Spinner'

/**
 * 获取文章列表
 * @param page
 * @param size
 * @param tag
 * @returns {function()}
 */
export const getBlogList = (page = 1, size = 30, tag) => (
  dispatch,
  getState,
) => {
  Spinner.show();
  return BlogApi.getBlogList(page, size, tag)
    .then(blogList => {
      Spinner.remove();
      dispatch({
        type: RouterBlog.GET_ARTICLE_LIST,
        data: blogList,
      });
      return blogList;
    })
    .catch(err => {
      err.interceptor && Notification.err('啊偶~读取文章列表失败~');
    });
};

/**
 * 清除 blog state
 */
export const clearBlogState = () => (dispatch, getState) => {
  dispatch({
    type: RouterBlog.CLEAR_BLOG_LIST_STATE,
  });
  return Promise.resolve();
};