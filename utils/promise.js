const _ = require('lodash');
const bluebird = require('bluebird');

const self = exports;

exports.for = bluebird.method((condition, action, value) => {
  if (!condition(value)) {
    return value;
  }

  return action(value)
    .then(self.for.bind(null, condition, action));
});

exports.while = (predicate, action) => {
  const loop = () => {
    if (!predicate()) {
      return bluebird.resolve();
    }

    return bluebird.resolve(action())
      .then(loop);
  };

  return bluebird.resolve()
    .then(loop);
};

// exports.retry = (action, credit, options) => action()
//   .catch((error) => {
//     if (credit <= 0) {
//       return bluebird.reject(error);
//     }

//     return bluebird.
//   });
