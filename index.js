/*!
 * resolve-from-npm | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/resolve-from-npm
*/
'use strict';

const inspect = require('util').inspect;

const npmCliDir = require('npm-cli-dir');
const resolveFrom = require('resolve-from');

module.exports = function resolveFromNpm(moduleId) {
  return npmCliDir().then(fromDir => {
    if (typeof moduleId !== 'string') {
      return Promise.reject(new TypeError(
        inspect(moduleId) +
        ' is not a string. Expected a module ID to resolve from npm directory (' +
        fromDir +
        ').'
      ));
    }

    const result = resolveFrom.silent(fromDir, moduleId);

    if (result === null) {
      const err = new Error(`Cannot find module \`${moduleId}\` from npm directory (${fromDir}).`);
      err.code = 'MODULE_NOT_FOUND';

      return Promise.reject(err);
    }

    return result;
  });
};
