export default class React {
  currentTree = {};

  /**
   * @param {string | Component} type 
   * @param {Array} props 
   * @param {Array} children 
   */
  static createElement(type, props = {}, ...children) {
    if (typeof type === "function" && type.prototype !== 'undefined') {
      const component = new type();
      return component.display();
    }
  
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          typeof child === 'string'
            ? { type: 'STRING_TYPE', props: { nodeTextValue: child, children: [] } }
            : child
        ),
      }
    }
  }

  /**
   * @param {Object} element 
   * @param {HTMLElement} domElement 
   */
  static renderDom(element, domElement) {
    this.#clearNode(domElement);
    this.#recursiveRender(element, domElement);
  }

  static #recursiveRender(element, domElement) {
    const node = element.type === 'STRING_TYPE'
      ? document.createTextNode(element.props.nodeTextValue)
      : document.createElement(element.type);
    
    element.props.children.forEach(child => {
       this.#recursiveRender(child, node);
    });
    domElement.appendChild(node);
  }

  /**
   * @param {HTMLElement} domElement 
   */
  static #clearNode(domElement) {
    domElement.hasChildNodes() && domElement.childNodes.forEach((child) => {
      domElement.removeChild(child);
    })
  }
}