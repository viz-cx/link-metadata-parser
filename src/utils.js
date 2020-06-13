function removeEmptyProperties(obj, recursive = false) {
  var result = {};
  for (var propName in obj) {
    if (recursive && typeof obj[propName] === "object") {
      obj[propName] = removeEmptyProperties(obj[propName]);
    }
    if (
      obj[propName] !== null &&
      obj[propName] !== undefined &&
      obj[propName] !== ""
    ) {
      result[propName] = obj[propName];
    }
  }
  return result;
}

module.exports = { removeEmptyProperties };
