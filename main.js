import './style.css'
import React, {Component} from './src/React/React'

import { Router } from './src/router.js'

class Page1 extends Component {

  constructor(props) {
    super(props);
    this.state = {number: 10};
  }

  render() {
    console.log(this.state)
    return React.createElement('div', null,
      React.createElement('h1', {title: 'EHKJZLNLAN'}, `Page Home {{props.title}}`),
      React.createElement('button', {
        onClick: () => {
          this.setState({ number: this.state.number + 1 });
        }
      }, 'clicked: '+ this.state.number),
      React.createElement('div', null,
        React.createElement('p',null, String(this.state.number)), 
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
