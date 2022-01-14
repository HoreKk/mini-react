import './style.css'
import React from './src/React/React'

import { Router } from './src/router.js'
import { RouterError } from './src/React/exceptions/RouterError';

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
<<<<<<< HEAD
    component: Page1.render()
=======
    component: Page1(),
>>>>>>> dcd1d199df737a13adf6ebeb9294b2968d797a31
  },
  {
    hash: 'about',
    component: Page2.render()
  }
]
console.log(React.createElement('h1', null, 'Page Home')); 

new Router(routes)




