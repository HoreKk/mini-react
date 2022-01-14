import isElementValid from "./helpers/domElement"
import type_check from "./helpers/typecheck"

export default class React {

  /**
   * @param {string | Component} type 
   * @param {Array} props 
   * @param {Array} children 
   */
  static createElement(type, props, ...children) {
    if (type_check(type, { type: 'string' }) && isElementValid(type)) {
      return {
        type: type,
        props: props,
        children: children,
      }
    }
    else {
      return type.render();
    }
  }

  /**
   * @param {HTMLElement} rootElem 
   * @param {Object} renderElem 
   */
  static renderDom(rootElem, renderElem) {
    if (!renderElem) {
      return;
    }
    if (type_check(renderElem, { type: 'string' })) {
      const text = document.createTextNode(renderElem);
      rootElem.appendChild(text);
    }
    else {
      const root = document.createElement(renderElem.type);
      renderElem.children && renderElem.children.forEach(element => {
        this.renderDom(root, element);
      });
      if (rootElem.childNodes.length) {
        rootElem.replaceChild(root, rootElem.childNodes[0]);
      } else {
        rootElem.appendChild(root);
      }
    }
  }
}