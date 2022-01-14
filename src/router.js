import React from "./React/React";

const rootElem = document.getElementById("root");
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentUrl = location.pathname.slice(1) + location.hash.slice(1) || '';
    this.render();
    window.onhashchange = () => {
      this.currentUrl = location.pathname.slice(1) + location.hash.slice(1) || '';
      this.render();
    };
  }

  render() {
      console.log(this.currentUrl)
    const route = this.routes.find(route => route.hash === this.currentUrl);
    console.log(location)
    if (route) {
      React.renderDom(rootElem, route.component);
    } else {
      rootElem.innerHTML = "404";
    }
  }
}

