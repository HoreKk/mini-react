const rootElem = document.getElementById("root");

export class Router {
  constructor(routes) {
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
    } else {
      rootElem.innerHTML = "404";
    }
  }
}