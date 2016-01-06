class Util {

  isObject(obj) {
    return typeof obj == 'object' && obj !== null && obj.constructor == Object
  }

  fmlm(content) {
    return '\n            '+
      content.toString()
        .replace(/\n$/, '')
        .replace(/\n/g, '\n            ')
  }
}

module.exports = new Util()
