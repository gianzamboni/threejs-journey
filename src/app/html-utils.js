export function createElement(tag, config) {
  const element = document.createElement(tag);
  for (const key in config) {
    element.setAttribute(key, config[key]);
  }
  return element;
}