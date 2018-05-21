'use strict';

const {isAbsolute, join} = require('path');

const inspectWithKind = require('inspect-with-kind');
const npmCliDir = require('npm-cli-dir');

const resolveFrom = typeof require.resolve.paths === 'function' ? function resolveFrom(fromDir, moduleId) {
	if (moduleId.startsWith('.')) {
		return require.resolve(join(fromDir, moduleId));
	}

	return require.resolve(moduleId, {paths: [join(fromDir, 'node_modules')]});
} : require('resolve-from');

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
		return resolveFrom(fromDir, moduleId);
	} catch (err) {
		err.message = `Cannot find module '${moduleId}' from the npm directory '${fromDir}'.`;
		throw err;
	}
};
