const ObjectToString = value => Object.prototype.toString.call(value);

const getPrototype = value => ObjectToString(value).slice(8, -1);

const isObject = (value) => {
  return getPrototype(value) === 'Object';
};

const isFunction = (value) => {
  return getPrototype(value) === 'Function';
};

const isNumber = (value) => {
  return getPrototype(value) === 'Number';
};

module.exports = {
  ObjectToString,
  isObject,
  isFunction,
  isNumber,
};