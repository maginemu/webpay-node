'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	_.each(_.filter(_.keys(pkg.devDependencies), function(dep) {
		return (dep.indexOf('grunt-') === 0);
	}), function(gruntDep) {
		grunt.loadNpmTasks(gruntDep);
	});

	grunt.initConfig({
		jshint: {
			files: [ 'lib/**/*.js', 'test/**/*.js', 'Gruntfile.js' ],
			options: {
				jshintrc:'.jshintrc'
			}
		},
		simplemocha: {
			all: {
				src: ['test/**/*.js']
			},
			options: {
				reporter: 'dot',
				ui: 'bdd'
			}
		}
	});

	grunt.registerTask('default', [ 'simplemocha', 'jshint' ]);
};
