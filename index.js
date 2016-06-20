/*!
 * resolve-from-npm | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/resolve-from-npm
*/
'use strict';

var inspect = require('util').inspect;

var npmCliDir = require('npm-cli-dir');
var PinkiePromise = require('pinkie-promise');
var resolveFrom = require('resolve-from');

module.exports = function resolveFromNpm(moduleId) {
  return npmCliDir().then(function(fromDir) {
    if (typeof moduleId !== 'string') {
      return PinkiePromise.reject(new TypeError(
        inspect(moduleId) +
        ' is not a string. Expected a module ID to resolve from npm directory (' +
        fromDir +
        ').'
      ));
    }

    var result = resolveFrom(fromDir, moduleId);

    if (result === null) {
      var err = new Error(
        'Cannot find module: "' +
        moduleId +
        '" from npm directory (' +
        fromDir +
        ').'
      );
      err.code = 'MODULE_NOT_FOUND';

      return PinkiePromise.reject(err);
    }

    return PinkiePromise.resolve(result);
  });
};
