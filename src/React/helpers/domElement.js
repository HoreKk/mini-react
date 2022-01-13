const validDomElements = ['div', 'section', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

/**
 * @param {string} elem 
 * @returns {boolean}
 */
export default function isElementValid(elem) {
  return validDomElements.includes(elem);
}