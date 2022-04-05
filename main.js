import './style.css'
import React, { Component } from './src/React/React'

import { Router } from './src/router.js'

const WEATHER_KEY = '87a10df4ddddd60c391bff27a294c152'

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
        React.createElement('p', null, String(this.state.number)),
        React.createElement('p', null, "une ligne")));
  }
}
class Page2 extends Component {
  constructor() {
    super();

    this._getWeather().then(data => {
      console.log(data)
      alert(`Position : ${data.name}, Description: ${data.weather[0].description}`)
    })
  }

  render() {
    return React.createElement('div', null, React.createElement('h1', null, 'Page About'), React.createElement('p', null, 'Ceci est un texte about'))
  }

  _getWeather() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_KEY}`).then(response => {
          resolve(response.json())
        }).catch(error => {
          reject(error)
        })
      });
    })


     
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
