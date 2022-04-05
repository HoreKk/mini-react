import updateNode from './helpers/updateNode';

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
    updateNode(prevVirtualDomNode.node, prevVirtualDomNode.element.props, element.props);
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
  const childNode = reconcile(oldChildNode, childElement, parentElement)
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
  
      updateNode(node, {}, element.props);
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
  publicInstance.componentDidMount();
  return virtualClassComponentNode;
}

/**
 * @param {Object} props 
 */
function parseNodeTextValue(props) {
  const text = String(props.nodeTextValue);
  let splitText = text.trim().split(/\{\{(.*?)\}\}/);
  
  splitText = splitText.map(text => {
    if (text.startsWith('props.')) {
      return String(props[text.split('.')[1]]) || '';
    }
    return String(text);
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

  componentDidMount() {};

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