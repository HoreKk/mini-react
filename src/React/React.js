import isElementValid from "./helpers/domElement"
import type_check from "./helpers/typecheck"

export default class React {

  /**
   * 
   * @param {string | Component} type 
   * @param {Array} props 
   * @param {Array} children 
   */
  static createElement(type, props, ...children) {
    console.log(':::::',type, props, children);
    if (type_check(type, { type: 'string' }) && isElementValid(type)) {
      return {
        type: type,
        props: props,
        children: children,
      }
    }
    if (type instanceof Component) {
      return type.render();
    }
  }
}