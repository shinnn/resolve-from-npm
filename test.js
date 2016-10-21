'use strict';

const path = require('path');

const escapeStringRegexp = require('escape-string-regexp');
const resolveFromNpm = require('.');
const test = require('tape');

test('resolveFromNpm()', t => {
  t.plan(8);

  t.strictEqual(resolveFromNpm.name, 'resolveFromNpm', 'should have a function name.');

  resolveFromNpm('semver').then(semverPath => {
    const semver = require(semverPath);

    t.strictEqual(
      semver.compare('2.0.0-rc1', '1.99.2-beta'),
      1,
      'should resolve the path of a module entry point.'
    );
  }).catch(t.fail);

  resolveFromNpm('request/package.json').then(requestPackageJsonPath => {
    t.strictEqual(
      require(requestPackageJsonPath).name,
      'request',
      'should resolve the path inside a module.'
    );
  }).catch(t.fail);

  resolveFromNpm('./package.json').then(npmPackageJsonPath => {
    t.strictEqual(
      require(npmPackageJsonPath).main,
      './lib/npm.js',
      'should resolve the path from a relative path.'
    );
  }).catch(t.fail);

  resolveFromNpm('package.json').then(t.fail, err => {
    const re = new RegExp(
      'Cannot find module `package\\.json` from npm directory \\(.*node_modules' +
      escapeStringRegexp(path.sep) +
      'npm\\)\\.'
    );

    t.ok(re.test(err.message), 'should fail when it cannot resolve a path.');

    t.strictEqual(
      err.code,
      'MODULE_NOT_FOUND',
      'should add `code` property to the error when it cannot resolve a path.'
    );
  }).catch(t.fail);

  resolveFromNpm(1).then(t.fail, err => {
    t.strictEqual(
      err.name,
      'TypeError',
      'should be rejected with a type error when it takes a non-string argument.'
    );
  }).catch(t.fail);

  resolveFromNpm().then(t.fail, err => {
    t.ok(
      / is not a string\. Expected a module ID to resolve from npm directory \(.*\)\./.test(err.message),
      'should be rejected with a type error when it takes no arguments.'
    );
  }).catch(t.fail);
});
