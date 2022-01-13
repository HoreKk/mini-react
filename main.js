import './style.css'
import React from './src/React/React'

console.log(React.createElement('div', null, React.createElement('h1', null, "test", React.createElement('div', null, null))));
import { Router } from './src/router.js'
import { RouterError } from './src/React/exceptions/RouterError';

const routes = [
  {
    hash: '',
    component: Page1(),
  },
  {
    hash: 'about',
    component: Page2()
  }
]

new Router(routes)

function Page1() {
  const h1 = document.createElement("h1");
  const text = document.createTextNode("Page Home");
  h1.appendChild(text);
  return h1;
}

function Page2() {
  const h1 = document.createElement("h1");
  const text = document.createTextNode("Page About");
  h1.appendChild(text);
  return h1;
}
