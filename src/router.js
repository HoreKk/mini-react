import React from "./React/React";
import { RouterError } from './React/exceptions/RouterError';

const rootElem = document.getElementById("root");

const routeProperties = ['hash', 'component']

export class Router {
  constructor(routes) {
    this._checkRoutes(routes)
    this.routes = routes;
    this.currentHash = location.pathname.slice(1) + location.hash.slice(1) || '';
    this.render();
    window.onhashchange = () => {
      this.currentHash = location.pathname.slice(1) + location.hash.slice(1) || '';
      this.render();
    };
  }

  render() {
    const route = this.routes.find(route => route.hash === this.currentHash);
    if (route) {
<<<<<<< HEAD
      React.renderDom(rootElem, route.component);
=======
      if (rootElem.childNodes.length) {
        rootElem.replaceChild(route.component, rootElem.childNodes[0]);
      } else {
        rootElem.appendChild(route.component);
      }

      Array.from(document.getElementsByClassName('nav-link')).forEach(navItem => {
        navItem.getAttribute('href') === `#${this.currentHash}`
          ? navItem.classList.add('active')
          : navItem.classList.remove('active')
      });
>>>>>>> dcd1d199df737a13adf6ebeb9294b2968d797a31
    } else {
      rootElem.innerHTML = "404";
    }
  }
<<<<<<< HEAD
}

=======

  _checkRoutes(routes) {
    routes.forEach(route => {
        const keys = Object.keys(route)
        keys.forEach(key => {
            if(!routeProperties.includes(key)) {
                throw new RouterError(`unknown property ${key}`)
            }
        })
        if (JSON.stringify(keys.sort()) !== JSON.stringify(routeProperties.sort())) {
            throw new RouterError(`missing property `, JSON.stringify(route))
        }
    })
  }
}
>>>>>>> dcd1d199df737a13adf6ebeb9294b2968d797a31
