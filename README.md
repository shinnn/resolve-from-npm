# resolve-from-npm

[![npm version](https://img.shields.io/npm/v/resolve-from-npm.svg)](https://www.npmjs.com/package/resolve-from-npm)
[![Build Status](https://travis-ci.com/shinnn/resolve-from-npm.svg?branch=master)](https://travis-ci.com/shinnn/resolve-from-npm)
[![codecov](https://codecov.io/gh/shinnn/resolve-from-npm/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/resolve-from-npm)

Resolve the path of a module from the directory where [npm CLI](https://github.com/npm/cli) is installed

```javascript
const resolveFromNpm = require('resolve-from-npm');

require.resolve('node-fetch-npm');
//=> '/path/to/the/current/directory/node_modules/node-fetch-npm/src/index.js'

(async () => {
  await resolveFromNpm('node-fetch-npm');
  //=> '/usr/local/lib/node_modules/npm/node_modules/node-fetch-npm/src/index.js'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install resolve-from-npm
```

## API

```javascript
const resolveFromNpm = require('resolve-from-npm');
```

### resolveFromNpm(*moduleId*)

*moduleId*: `string` (a module ID)  
Return: `Promise<string>`

It resolves the path of a module from the path where [npm-cli-dir](https://github.com/shinnn/npm-cli-dir) resolves.

```javascript
(async () => {
  await resolveFromNpm('./lib/install'); //=> '/usr/local/lib/node_modules/npm/lib/install.js'
})();

(async () => {
  try {
    // npm CLI doesn't contain a file './hi'
    await resolveFromNpm('./hi');
  } catch (err) {
    err.code; //=> 'MODULE_NOT_FOUND'
    err.message; //=> "Cannot find module './hi' from npm directory '/usr/local/lib/node_modules/npm'."
    err.npmDir; //=> '/usr/local/lib/node_modules/npm'
  }
})();
```

## License

[ISC License](./LICENSE) © 2017 - 2019 Watanabe Shinnosuke
