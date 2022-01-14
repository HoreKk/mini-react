import './style.css'
import React from './src/React/React'
import Component from './src/React/Component';

import Component from './src/React/Component';
import { Router } from './src/router.js'

class Page1 extends Component {
  display() {
    return React.createElement('h1', null, 'Page Home'); 
  }
}
class Page2 extends Component{
  display() {
    return React.createElement('div', null, React.createElement('h1', null, 'Page About'), React.createElement('p', null, 'Ceci est un texte about'))
  }
}

const routes = [
  {
    hash: '',
    component: Page1
  },
  {
    hash: 'about',
    component: Page2
  }
]

new Router(routes)
