
const toArray = (target) => {
  if (target instanceof Array) {
    return target;
  }
  else if (target instanceof HTMLElement || target instanceof HTMLDocument) {
    return [target];
  }
  else if (target instanceof HTMLCollection) {
    return Array.from(target);
  }
};

export const add = (target, children) => {
  const elements = toArray(children);
 
  if (!elements) {
    throw new Error('invalid child elements');
  }

  elements.forEach((c) => target.appendChild(c));
};

export const each = (target, action) => {
  const elements = toArray(target);
 
  if (!elements) {
    throw new Error('invalid target');
  }

  elements.forEach((e) => action(e));
};

const isContent = (x) => x.constructor.name === 'String' || 
  x instanceof Array || 
  x instanceof HTMLElement || 
  x instanceof HTMLCollection;

export const create = (tagName, ...args) => {
  const element = document.createElement(tagName);

  const properties = args.find((a) => !isContent(a));

  if (properties) {
    Object.assign(element, properties);
  }

  const content = args.find(isContent);

  if (content) {
    if (content.constructor.name === 'String') {
      element.innerHTML = content;
    }
    else {
      add(element, content);
    }
  }

  return element;
};

export const find = (...args) => {
  const selector = args.pop();
  const target = args.length ? args[0] : document;
  return Array.from(target.querySelectorAll(selector));
}

export const get = (id) => document.getElementById(id);

export const on = (target, type, handler) => each(target, (e) => e.addEventListener(type, handler));

export const style = (target, styles) => each(target, (e) => {
  Object.entries(styles).forEach((s) => {
    const [ name, value ] = s;
    e.style[name] = value;
  });
});

export default { add, create, each, find, get, on, style };