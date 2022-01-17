let virtualDomInstance = {};

/**
 * @param {string | Component} type 
 * @param {Array} props 
 * @param {Array} children 
 */
function createElement(type, props = {}, ...children) {
  if (typeof type === "function" && type.prototype !== 'undefined') {
    const component = new type();
    return component.display(props);
  }

  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'string'
          ? { type: 'STRING_TYPE', props: { nodeTextValue: child,...props, children: [] } }
          : child
      ),
    }
  }
}

/**
 * @param {Object} element 
 * @param {HTMLElement} domElement 
 */
function renderDom(element, domElement) {
  let prevVirtualDomNode = virtualDomInstance; 
  virtualDomInstance = reconcile(prevVirtualDomNode, element, domElement);
  console.log(virtualDomInstance)
}

/**
 * @link https://reactjs.org/docs/reconciliation.html
 */
function reconcile(prevVirtualDomNode, element, parentElement) {
  if (prevVirtualDomNode === null || !Object.keys(prevVirtualDomNode).length) {
    const newVirtualDomNode = createVirtualDomNode(element);
    parentElement.appendChild(newVirtualDomNode.node);
    return newVirtualDomNode;
  }
  const newVirtualDomNode = createVirtualDomNode(element);
  parentElement.replaceChild(newVirtualDomNode.node, prevVirtualDomNode.node)
  return newVirtualDomNode;
}

function createVirtualDomNode(element) {
  const node = element.type === 'STRING_TYPE'
    ? document.createTextNode(parseNodeTextValue(element.props))
    : document.createElement(element.type);
  
  Object.keys(element.props)
    .filter((propName) => propName.startsWith('on'))
    .forEach((propName) => {
      node.addEventListener(propName.substring(2).toLowerCase(), element.props[propName]);
    });
  
  Object.keys(element.props)
    .filter((propName) => !propName.startsWith('on') && propName !== "children" && typeof element.type !== 'string')
    .forEach((propName) => {
      node[propName] = element.props[propName];
    })
  
  const childElements = element.props.children || [];
  const childNodes = childElements.map(createVirtualDomNode)
  childNodes.forEach(childNode => node.appendChild(childNode.node));

  return { node, element, childNodes }
}

/**
 * @param {Object} element 
 * @param {HTMLElement} domElement 
 */

/**
 * @param {string} text 
 * @param {Object} props 
 */
function parseNodeTextValue(props) {
  const text = String(props.nodeTextValue);
  let splitText = text.trim().split(' ');
  splitText = splitText.map((elem) => {
    if (elem.match(/\{\{(.+?)\}\}/g)) {
      return props[elem.replace('{{', '').replace('}}', '').split('.')[1]] || '';
    }
    return elem;
  })

  return splitText.join(' ');
}

export class Component {
  props = {};
  state = {};

  constructor(props) {
    this.props = props;
    if (this.constructor === Component) {
        throw new Error("Can't instantiate Component.");
    }
  }

  display(newProps) {
    if (this.#shouldUpdate(newProps)) {
      return this.render();
    }
  }

  #shouldUpdate(newProps) {
    if(JSON.stringify(newProps) !== JSON.stringify(this.props)) {
        this.currentProps = newProps;
        return true;
    }
    return false;
  }
  
  render() {
    throw new Error("render() need to be implemented");
  }
}

export default {
  createElement,
  renderDom,
}