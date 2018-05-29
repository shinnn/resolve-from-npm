'use strict';

const {isAbsolute, join} = require('path');

const inspectWithKind = require('inspect-with-kind');
const npmCliDir = require('npm-cli-dir');

module.exports = async function resolveFromNpm(moduleId) {
	const fromDir = await npmCliDir();

	if (typeof moduleId !== 'string') {
		throw new TypeError(`Expected a module ID to resolve from npm directory (${fromDir}), but got ${
			inspectWithKind(moduleId)
		}.`);
	}

	// Should drop absolute path support in the future
	if (isAbsolute(moduleId)) {
		return require.resolve(moduleId);
	}

	try {
		if (moduleId.startsWith('.')) {
			return require.resolve(join(fromDir, moduleId));
		}

		return require.resolve(moduleId, {paths: [join(fromDir, 'node_modules')]});
	} catch (err) {
		err.message = `Cannot find module '${moduleId}' from the npm directory '${fromDir}'.`;
		throw err;
	}
};
