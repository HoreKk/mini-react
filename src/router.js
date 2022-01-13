import { RouterError } from './React/exceptions/RouterError';

const rootElem = document.getElementById("root");

const routeProperties = ['hash', 'component']

export class Router {
  constructor(routes) {
    this._checkRoutes(routes)
    this.routes = routes;
    this.currentUrl = location.pathname.slice(1) + location.hash.slice(1) || '';
    this.render();
    window.onhashchange = () => {
      this.currentUrl = location.pathname.slice(1) + location.hash.slice(1) || '';
      this.render();
    };
  }

  render() {
    const route = this.routes.find(route => route.hash === this.currentUrl);
    if (route) {
      if (rootElem.childNodes.length) {
        rootElem.replaceChild(route.component, rootElem.childNodes[0]);
      } else {
        rootElem.appendChild(route.component);
      }
    } else {
      rootElem.innerHTML = "404";
    }
  }

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