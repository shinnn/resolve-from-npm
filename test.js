'use strict';

const {join} = require('path');
const {promisify} = require('util');
const {symlink} = require('fs');

const npmCliDir = require('npm-cli-dir');
const resolveFromNpm = require('.');
const rmfr = require('rmfr');
const test = require('tape');

const promisifiedSymlink = promisify(symlink);

test('resolveFromNpm()', async t => {
	t.plan(9);

	const symlinkPath = join(__dirname, 'tmp.js');
	const brokenSymlinkPath = join(__dirname, 'tmp-broken.js');

	await rmfr(`{${symlinkPath},${brokenSymlinkPath}}`, {glob: true});
	await Promise.all([
		promisifiedSymlink(__filename, symlinkPath),
		promisifiedSymlink('this__file__does__not__exist', brokenSymlinkPath)
	]);

	const dir = await npmCliDir();

	resolveFromNpm('semver').then(semverPath => {
		const semver = require(semverPath);

		t.equal(
			semver.compare('2.0.0-rc1', '1.99.2-beta'),
			1,
			'should resolve the path of a module entry point.'
		);
	}).catch(t.fail);

	resolveFromNpm('request/package.json').then(requestPackageJsonPath => {
		t.equal(
			require(requestPackageJsonPath).name,
			'request',
			'should resolve the path inside a module.'
		);
	}).catch(t.fail);

	resolveFromNpm('./package.json').then(npmPackageJsonPath => {
		t.equal(
			require(npmPackageJsonPath).main,
			'./lib/npm.js',
			'should resolve the path from a relative path.'
		);
	}).catch(t.fail);

	resolveFromNpm(symlinkPath).then(resolvedSymlinkPath => {
		t.equal(
			resolvedSymlinkPath,
			__filename,
			'should resolve symbolic links.'
		);
	}).catch(t.fail);

	resolveFromNpm('package.json').then(t.fail, ({code, message}) => {
		t.equal(
			message,
			`Cannot find module \`package.json\` from npm directory (${dir}).`,
			'should fail when it cannot resolve a path.'
		);

		t.equal(
			code,
			'MODULE_NOT_FOUND',
			'should add `code` property to the error when it cannot resolve a path.'
		);
	}).catch(t.fail);

	resolveFromNpm(brokenSymlinkPath).then(t.fail, ({message}) => {
		t.equal(
			message,
			`Cannot find module \`${brokenSymlinkPath}\` from npm directory (${dir}).`,
			'should fail when it can find a symlink but cannot resolve a path from it.'
		);
	}).catch(t.fail);

	resolveFromNpm(1).then(t.fail, err => {
		t.equal(
			err.name,
			'TypeError',
			'should be rejected with a type error when it takes a non-string argument.'
		);
	}).catch(t.fail);

	resolveFromNpm().then(t.fail, ({message}) => {
		t.equal(
			message,
			`Expected a module ID to resolve from npm directory (${dir}), but got undefined.`,
			'should be rejected with a type error when it takes no arguments.'
		);
	}).catch(t.fail);
});
