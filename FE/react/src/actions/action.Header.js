'use strict'
import { Header } from '../actions/typs'


export const setHeaderScrollLimit = (value)=>(dispatch, getState)=> {
  dispatch({
    type: Header.SET_HEADER_SCROLL_LIMIT,
    data: value
  })
}

export const showHeader = (value)=>(dispatch, getState)=> {
  dispatch({
    type: Header.SHOW_HEADER
  })
}