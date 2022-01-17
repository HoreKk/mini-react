const virtualDomInstance = null;

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
  recursiveRender(element, domElement);
}

/**
 * @param {Object} element 
 * @param {HTMLElement} domElement 
 */
function recursiveRender(element, domElement) {
  const node = element.type === 'STRING_TYPE'
    ? document.createTextNode(parseNodeTextValue(element.props))
    : document.createElement(element.type);
  
  element.props.children.forEach(child => {
      recursiveRender(child, node);
  });

  if (element.props.onClick) {
    domElement.addEventListener('click', () => element.props.onClick());
  }
  domElement.appendChild(node);
}

/**
 * @param {string} text 
 * @param {Object} props 
 */
function parseNodeTextValue(props) {
  const text = String(props.nodeTextValue);
  let splitText = text.trim().split(' ');
  splitText = splitText.map((elem) => {
    if (elem.match(/\{\{(.+?)\}\}/g)) {
      console.log(elem);
      return props[elem.replace('{{', '').replace('}}', '').split('.')[1]] || '';
    }
    return elem;
  })

  return splitText.join(' ');
}

export default {
  createElement,
  renderDom,
}