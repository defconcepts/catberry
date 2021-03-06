/*
 * catberry
 *
 * Copyright (c) 2014 Denis Rechkunov and project contributors.
 *
 * catberry's license follows:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This license applies to all parts of catberry that are not externally
 * maintained libraries.
 */

'use strict';

var assert = require('assert'),
	fs = require('fs'),
	path = require('path'),
	events = require('events'),
	ServiceLocator = require('catberry-locator'),
	Logger = require('../../mocks/Logger'),
	ComponentFinder = require('../../../lib/finders/ComponentFinder');

var CASE_PATH = path.join(
	'test', 'cases', 'lib', 'finders', 'ComponentFinder'
);

describe('lib/finders/ComponentFinder', function () {
	describe('#find', function () {
		it('should find all valid components', function (done) {
			var locator = createLocator({
					componentsGlob: 'test/**/test-cat-component.json'
				}),
				finder = locator.resolve('componentFinder');

			var expectedPath = path.join(
					process.cwd(), CASE_PATH, 'expected.json'
				),
				expected = require(expectedPath);

			finder
				.find()
				.then(function (found) {
					assert.strictEqual(
						Object.keys(found).length,
						Object.keys(expected).length,
						'Wrong store count'
					);

					Object.keys(expected)
						.forEach(function (name) {
							assert.strictEqual(
								(name in found), true,
								name + ' not found'
							);
							assert.strictEqual(
								found[name].name, expected[name].name
							);
							assert.strictEqual(
								found[name].path, expected[name].path
							);
							assert.deepEqual(
								found[name].properties,
								expected[name].properties
							);
						});
					done();
				})
				.catch(done);
		});
		it('should find all valid components by globs array', function (done) {
			var caseRoot = 'test/cases/lib/finders/ComponentFinder/components',
				locator = createLocator({
					componentsGlob: [
						caseRoot + '/test1/**/test-cat-component.json',
						caseRoot + '/test1/test-cat-component.json',
						caseRoot + '/test3/**/test-cat-component.json',
						caseRoot + '/test3/test-cat-component.json'
					]
				}),
				finder = locator.resolve('componentFinder');

			var expectedPath = path.join(
					process.cwd(), CASE_PATH, 'expected.json'
				),
				expected = require(expectedPath);

			finder
				.find()
				.then(function (found) {
					assert.strictEqual(
						Object.keys(found).length,
						Object.keys(expected).length,
						'Wrong store count'
					);

					Object.keys(expected)
						.forEach(function (name) {
							assert.strictEqual(
								(name in found), true,
								name + ' not found'
							);
							assert.strictEqual(
								found[name].name, expected[name].name
							);
							assert.strictEqual(
								found[name].path, expected[name].path
							);
							assert.deepEqual(
								found[name].properties,
								expected[name].properties
							);
						});
					done();
				})
				.catch(done);
		});
	});
});

function createLocator(config) {
	var locator = new ServiceLocator();
	locator.registerInstance('serviceLocator', locator);
	locator.registerInstance('config', config);
	locator.registerInstance('eventBus', new events.EventEmitter());
	locator.register('componentFinder', ComponentFinder, config);
	locator.register('logger', Logger, config);
	return locator;
}