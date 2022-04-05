import './style.css'
import React, {Component} from './src/React/React'

import { Router } from './src/router.js'

class Page1 extends Component {

  constructor(props) {
    super(props);
    this.state = { number: 10, input: "", title: "Titre" };
  }

  componentDidMount() {
    console.log('Page1 mounted');
  }

  render() {
    return React.createElement('div', null,
      React.createElement('h1', {titre: this.state.title, className: this.state.title}, `Page Home {{props.titre}}`),
      React.createElement('input', { onChange: (e) => { this.setState({input: e.target.value})}}),
      React.createElement('button', {
        onClick: () => {
          this.setState({ title: this.state.input });
        }
      }, 'Click me'),
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
