var util = require('util');
var common = exports;

Object.keys(util).forEach(function (key) {
  common[key] = util[key];
});

common.isString = function (str) {
  return typeof(str) === 'string';
};

common.clone = function _clone(object) {
    var keys, prop, clone = {};

    assert.ok(object);

    keys = Object.getOwnPropertyNames(object);
    keys.forEach(function (k) {
        prop = Object.getOwnPropertyDescriptor(object, k);

        Object.defineProperty(clone, k, prop);
    });

    return clone;
};

common.args = function args(data, offset) {
  return Array.prototype.slice.call(data, arguments.length > 1 ? offset : 0);
};

common.mix = common.mixin = function mixin(target) {
  common.args(arguments, 1).forEach(function (o) {
    Object.getOwnPropertyNames(o).forEach(function(attr) {
      var getter = Object.getOwnPropertyDescriptor(o, attr).get,
          setter = Object.getOwnPropertyDescriptor(o, attr).set;

      if (!getter && !setter) {
        target[attr] = o[attr];
      }
      else {
        Object.defineProperty(target, attr, {
          get: getter,
          set: setter
        });
      }
    });
  });

  return target;
};
