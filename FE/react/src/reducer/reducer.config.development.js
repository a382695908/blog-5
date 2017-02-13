'use strict';

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import Blog from './reducer.Blog'
import Header from './reducer.Header'
import Article from './reducer.ArticleDetail'
import Discuss from './reducer.Discuss'
import Me from './reducer.Me'

const appReducer = combineReducers({
  Blog,
  Header,
  Article,
  Discuss,
  Me,
  routing: routerReducer,
  form: formReducer
});

export default appReducer;