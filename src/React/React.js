let virtualDomInstance = {};

/**
 * @param {string | Component} type 
 * @param {Array} props 
 * @param {Array} children 
 */
function createElement(type, props = {}, ...children) {
  if (typeof type === "function" && type.prototype !== 'undefined') {
    console.log(props);
    const component = new type(props);
    return component.render(props);
  }

  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'string'
          ? { type: 'STRING_TYPE', props: { nodeTextValue: child, ...props, children: [] } }
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
}


function isAttribute(element, key) {
  return !key.startsWith('on') && key !== "children" && typeof element.type !== 'string'
}

function isEventHandler(key) {
  return key.startsWith('on');
}

function updateNode(oldNode, element) {
  console.log('updateNode');
  // on remove les anciens events handler
  Object.keys(oldNode.element.props).filter(isEventHandler).forEach((key) => {
    oldNode.node.removeEventListener(key.substring(2).toLowerCase(), oldNode.props[key]);
  })

  // on remove les anciens attribut
  Object.keys(oldNode.element.props).filter(isAttribute).forEach((key) => {
    oldNode.node[key] = null;
  })

  // on rajoute les nouveaux event listener
  Object.keys(element.props).filter(isEventHandler).forEach((key) => {
    oldNode.addEventListener(key.substring(2).toLowerCase(), element.props[key]);
  });
  
  // on rajoute les nouveaux attribut
  Object.keys(element.props).filter(isAttribute).forEach((key) => {
      oldNode[key] = element.props[key];
  })
}

/**
 * @link https://reactjs.org/docs/reconciliation.html
 * @param {Object} prevVirtualDomNode 
 * @param {Object} element 
 * @param {HTMLElement} parentElement 
 * @returns {Object}
 */
function reconcile(prevVirtualDomNode, element, parentElement) {
  if (prevVirtualDomNode === null || !Object.keys(prevVirtualDomNode).length) {
    const newVirtualDomNode = createVirtualDomNode(element);
    parentElement.appendChild(newVirtualDomNode.node);
    return newVirtualDomNode;
  }
  if (prevVirtualDomNode.element.type !== element.type) {
    updateNode(prevVirtualDomNode, element);
    prevVirtualDomNode.childNodes = reconcileChildrenNode(prevVirtualDomNode, element);
    prevVirtualDomNode.element = element;
    return prevVirtualDomNode;
  }
  const newVirtualDomNode = createVirtualDomNode(element);
  parentElement.replaceChild(newVirtualDomNode.node, prevVirtualDomNode.node)
  return newVirtualDomNode;
}

function createVirtualDomNode(element) {
  const node = element.type === 'STRING_TYPE'
    ? document.createTextNode(parseNodeTextValue(element.props))
    : document.createElement(element.type);
  
  Object.keys(element.props).filter(isEventHandler).forEach((key) => {
    node.addEventListener(key.substring(2).toLowerCase(), element.props[key]);
  });
  
  Object.keys(element.props).filter((key) => isAttribute(element, key)).forEach((key) => {
      node[key] = element.props[key];
    })
    
  const childElements = element.props.children || [];
  const childNodes = childElements.map(createVirtualDomNode)
  childNodes.forEach(childNode => node.appendChild(childNode.node));

  return { node, element, childNodes }
}

/**
 * @param {Object} props 
 */
function parseNodeTextValue(props) {
  const text = String(props.nodeTextValue);
  let splitText = text.trim().split(' ');
  splitText = splitText.map((elem) => {
    if (elem.match(/\{\{(.+?)\}\}/g)) {
      return String(props[elem.replace('{{', '').replace('}}', '').split('.')[1]]) || '';
    }
    return elem;
  })
  return splitText.join(' ');
}

export class Component {

  // on modifie l'etat et force le rerender pour afficher les nouvelles valeurs
  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    console.log(virtualDomInstance);
    this.render();
  }

  constructor(props) {
    this.props = props || {};
    this.state = {};
    if (this.constructor === Component) {
        throw new Error("Can't instantiate Component.");
    }
    console.log('Component', this);
  }

  display(newProps) {
    if (this.#shouldUpdate(newProps)) {
      return this.render();
    }
  }

  #shouldUpdate(newProps) {
    if(JSON.stringify(newProps) !== JSON.stringify(this.props)) {
        this.props = newProps;
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