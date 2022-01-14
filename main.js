import './style.css'
import React from './src/React/React'
import Component from './src/React/Component';

import { Router } from './src/router.js'

class Page1 {
  static render() {
    return React.createElement('h1', null, 'Page Home'); 
  }
}

class Page2 {
  static render() {
    return React.createElement('h1', null, 'Page About'); 
  }
}

const routes = [
  {
    hash: '',
    component: Page1.render()
  },
  {
    hash: 'about',
    component: Page2.render()
  }
]

new Router(routes)
