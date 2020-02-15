const deepFreeze = obj =>
  Array.isArray(obj) ? obj.map(deepFreeze) : Object.freeze(obj);

export default deepFreeze;
