'use strict';

const {inspect} = require('util');
const {isAbsolute, join} = require('path');

const inspectWithKind = require('inspect-with-kind');
const npmCliDir = require('npm-cli-dir');

module.exports = async function resolveFromNpm(moduleId) {
	const fromDir = await npmCliDir();
	const errorMessageStart = `Expected a module ID to resolve from npm directory (${fromDir})`;

	if (typeof moduleId !== 'string') {
		const error = new TypeError(`${errorMessageStart}, but got ${inspectWithKind(moduleId)}.`);

		error.code = 'ERR_INVALID_ARG_TYPE';
		throw error;
	}

	if (moduleId.length === 0) {
		const error = new Error(`${{errorMessageStart}}, but got an empty string ''.`);

		error.code = 'ERR_INVALID_ARG_VALUE';
		throw error;
	}

	if (isAbsolute(moduleId)) {
		const error = new Error(`${errorMessageStart}, but got an absolute path ${
			inspect(moduleId, {breakLength: Infinity})
		}. For absolute paths there is no need to use \`resolve-from-npm\` in favor of Node.js built-in \`require.resolve()\`.`);

		error.code = 'ERR_ABSOLUTE_MODULE_ID';
		throw error;
	}

	try {
		if (moduleId.startsWith('.')) {
			return require.resolve(join(fromDir, moduleId));
		}

		return require.resolve(moduleId, {paths: [join(fromDir, 'node_modules')]});
	} catch (err) {
		err.message = `Cannot find module '${moduleId}' from the npm directory '${fromDir}'.`;
		err.npmDir = fromDir;

		throw err;
	}
};
