let virtualDomInstance = {};

/**
 * @param {string | Component} type 
 * @param {Array} props 
 * @param {Array} children 
 */
function createElement(type, props = {}, ...children) {
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
  const nextInstance = reconcile(prevVirtualDomNode, element, domElement);
  virtualDomInstance = nextInstance;
}


function isAttribute(element, key) {
  return !key.startsWith('on') && key !== "children" && typeof element.type !== 'string'
}

function isEventHandler(key) {
  return key.startsWith('on');
}

function updateNode(oldNode, element) {
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

function reconcileChildren(prevVirtualNode, element) {
  const node = prevVirtualNode.node;
  const childNodes = prevVirtualNode.childNodes;
  const nextChildElements = element.props.children || [];
  const newChildNodes = [];
  const count = Math.max(prevVirtualNode.childNodes.length, nextChildElements.length); 
  
  for (let i = 0; i < count; i++) {
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(childNodes[i], childElement, node);
    newChildNodes.push(newChildInstance);
  }

  return newChildNodes.filter(node => node != null);
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
  if (element === null) {
    prevVirtualDomNode.node.remove();
    return null;
  }
  if (prevVirtualDomNode.element.type !== element.type) {
    const newVirtualDomNode = createVirtualDomNode(element);
    prevVirtualDomNode.node.replaceWith(newVirtualDomNode.node);
    return newVirtualDomNode;
  }
  if (typeof element.type === 'string') {
    prevVirtualDomNode.childNodes = reconcileChildren(prevVirtualDomNode, element);
    prevVirtualDomNode.element = element;
    const newElem = createVirtualDomNode(prevVirtualDomNode.element);
    if (prevVirtualDomNode.node.nodeType === 3) {
      prevVirtualDomNode.node.nodeValue = newElem.node.nodeValue;
    } else {
      newElem.node.replaceWith(prevVirtualDomNode.node);
    }
    return prevVirtualDomNode;
  }
  
  prevVirtualDomNode.publicInstance.props = element.props;
  const childElement = prevVirtualDomNode.publicInstance.display();
  const oldChildNode = prevVirtualDomNode.childNode;
  const childNode = reconcile(oldChildNode, childElement,parentElement)
  prevVirtualDomNode.node = childNode.node;
  prevVirtualDomNode.childNode = childNode;
  prevVirtualDomNode.element = element;
  return prevVirtualDomNode;
}

function createPublicInstance(element, internalInstance) {
  const { type, props } = element; 
  const publicInstance = new type(props); // the type is a class so we use the *new* keyword
  publicInstance.setInternalInstance(internalInstance);
  return publicInstance;
}

function createVirtualDomNode(element) {
  if (typeof element.type === 'string') {
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
  const virtualClassComponentNode = {};
  const publicInstance = createPublicInstance(element, virtualClassComponentNode);
  const childElement = publicInstance.render();
  const childNode = createVirtualDomNode(childElement);
  const node = childNode.node;

  Object.assign(virtualClassComponentNode, { node, element, childNode, publicInstance })
  return virtualClassComponentNode;
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
  #internalInstance;

  // on modifie l'etat et force le rerender pour afficher les nouvelles valeurs
  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    reconcile(this.#internalInstance, this.#internalInstance.element, this.#internalInstance.node.parentElement);
  }

  constructor(props) {
    this.props = props || {};
    this.state = {};
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
        this.props = newProps;
        return true;
    }
    return false;
  }
  
  setInternalInstance(internalInstance) {
    this.#internalInstance = internalInstance;
  }

  render() {
    throw new Error("render() need to be implemented");
  }
}

export default {
  createElement,
  renderDom,
}