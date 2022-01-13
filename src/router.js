const rootElem = document.getElementById("root");

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentUrl = location.hash.slice(1) || '';
    this.render();
    window.onhashchange = () => {
      this.currentUrl = location.hash.slice(1) || '';
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
}