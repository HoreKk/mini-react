import './style.css'
import React, {Component} from './src/React/React'

import { Router } from './src/router.js'

class Page1 extends Component {
  state = {
    title: 'test'
  } 
  render() {
    return React.createElement('div', null,
      React.createElement('h1', null, 'Page Home {{this.state.title}} {{testaaa}}'),
      React.createElement('button', { onSubmit: () => this.props.tilte = 'Update', title: this.state.title }, 'changer le titre'),
      React.createElement('div', null,
        React.createElement('p',null, "une ligne"), 
        React.createElement('p',null, "une ligne"))); 
  }
}
class Page2 extends Component{
  render() {
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
