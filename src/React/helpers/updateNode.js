import { attributeMap } from "./attributeMap";

function isAttribute(key) {
  return !key.startsWith('on') && key !== "children" && typeof key.type !== 'string' && isValidAttributeOrEventHandler(key);
}

function isEventHandler(key) {
  return key.startsWith('on') && isValidAttributeOrEventHandler(key);
}

function isValidAttributeOrEventHandler(key) {
  return !!attributeMap[key];
}

function updateNode(node, oldProps, newProps) {
  Object.keys(oldProps).filter(isEventHandler).forEach((key) => {
    if (attributeMap[key]) {
      node.removeEventListener(attributeMap[key], oldProps[key]);
    }
  })

  // on remove les anciens attribut
  Object.keys(oldProps).filter(isAttribute).forEach((key) => {
    node[key] = null;
  })

  // on rajoute les nouveaux event listener
  Object.keys(newProps).filter(isEventHandler).forEach((key) => {
    if (attributeMap[key]) {
      node.addEventListener(attributeMap[key], newProps[key]);
    }
  });
  
  // on rajoute les nouveaux attribut
  Object.keys(newProps).filter(isAttribute).forEach((key) => {
    if (attributeMap[key]) {
      try {
        node.setAttribute(attributeMap[key], newProps[key]);
      } catch(e){}
    }
  })
}

export default updateNode;