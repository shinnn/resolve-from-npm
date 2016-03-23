# resolve-from-npm

[![NPM version](https://img.shields.io/npm/v/resolve-from-npm.svg)](https://www.npmjs.com/package/resolve-from-npm)
[![Build Status](https://travis-ci.org/shinnn/resolve-from-npm.svg?branch=master)](https://travis-ci.org/shinnn/resolve-from-npm)
[![Build status](https://ci.appveyor.com/api/projects/status/63lufw43bx54l9wp/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/resolve-from-npm/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/resolve-from-npm.svg)](https://coveralls.io/github/shinnn/resolve-from-npm)
[![Dependency Status](https://david-dm.org/shinnn/resolve-from-npm.svg)](https://david-dm.org/shinnn/resolve-from-npm)
[![devDependency Status](https://david-dm.org/shinnn/resolve-from-npm/dev-status.svg)](https://david-dm.org/shinnn/resolve-from-npm#info=devDependencies)

Resolve the path of a module from the directory where [npm](https://www.npmjs.com/package/npm) is installed

```javascript
const resolveFromNpm = require('resolve-from-npm');

require.resolve('npm-registry-client');
//=> 'path/to/current/directory/node_modules/npm-registry-client/index.js'

resolveFromNpm('npm-registry-client').then(resolvedPath => {
  resolvedPath;
  //=> '/usr/local/lib/node_modules/npm/node_modules/npm-registry-client/index.js'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install resolve-from-npm
```

## API

```javascript
const resolveFromNpm = require('resolve-from-npm');
```

### resolveFromNpm(*moduleId*)

*moduleId*: `String` (a module ID)  
Return: `Object` (a [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) instance)

It resolves the path of a module from the path where [npm-cli-dir](https://github.com/shinnn/npm-cli-dir) resolves.

The returned promise will be [fulfilled](http://promisesaplus.com/#point-26) with a string of the resolved file path, or [rejected](http://promisesaplus.com/#point-30) when it fails to find the module.

```javascript
resolveFromNpm('./lib/install').then(resolvedPath => {
  resolvedPath; //=> '/usr/local/lib/node_modules/npm/lib/install.js'
});

resolveFromNpm('lib/install').catch(err => {
  err.message; //=> 'Cannot find module: "lib/install" from npm directory (/usr/local/lib/node_modules/npm).'
});
```

## License

Copyright (c) 2015 - 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
