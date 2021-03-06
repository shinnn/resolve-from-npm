'use strict';

const {inspect} = require('util');

const npmCliDir = require('npm-cli-dir');
const resolveFromNpm = require('.');
const test = require('tape');

test('resolveFromNpm()', async t => {
	t.plan(11);

	const dir = await npmCliDir();

	const semver = require(await resolveFromNpm('semver'));
	t.equal(
		semver.compare('2.0.0-rc1', '1.99.2-beta'),
		1,
		'should resolve the path of a module entry point.'
	);

	t.equal(
		require(await resolveFromNpm('request/package.json')).name,
		'request',
		'should resolve the path inside a module.'
	);

	t.equal(
		require(await resolveFromNpm('./package.json')).main,
		'./lib/npm.js',
		'should resolve the path from a relative path.'
	);

	try {
		await resolveFromNpm('package.json');
	} catch ({code, message, npmDir}) {
		t.equal(
			message,
			`Cannot find module 'package.json' from the npm directory '${dir}'.`,
			'should fail when it cannot resolve a path.'
		);

		t.equal(
			code,
			'MODULE_NOT_FOUND',
			'should add `code` property to the error when it cannot resolve a path.'
		);

		t.equal(
			npmDir,
			dir,
			'should add `npmDir` property to the error when it cannot resolve a path.'
		);
	}

	try {
		await resolveFromNpm(__filename);
	} catch ({code, message}) {
		t.ok(
			message.includes(`got an absolute path ${inspect(__filename)}`),
			'should fail when it takes an absolute path.'
		);

		t.equal(
			code,
			'ERR_ABSOLUTE_MODULE_ID',
			'should set error code when it takes an absolute path.'
		);
	}

	try {
		await resolveFromNpm('');
	} catch ({code}) {
		t.equal(
			code,
			'ERR_INVALID_ARG_VALUE',
			'should fail when it takes an empty string.'
		);
	}

	try {
		await resolveFromNpm(1);
	} catch ({name}) {
		t.equal(
			name,
			'TypeError',
			'should fail when it takes a non-string argument.'
		);
	}

	try {
		await resolveFromNpm();
	} catch ({message}) {
		t.equal(
			message,
			`Expected a module ID to resolve from npm directory (${dir}), but got undefined.`,
			'should fail when it takes no arguments.'
		);
	}
});
