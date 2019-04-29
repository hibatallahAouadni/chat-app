module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test.js'
                ]
            }
        },
        connect: {
            dev: {
                options: {
                    port: 8124,
                    base: '.',
                    keepalive: true
                }
            }
        },
        mocha_phantomjs: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: ['test.html']
            }
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('dev', ['connect:dev']);
    grunt.registerTask('default', ['jshint', 'mochaTest', 'mocha_phantomjs']);
};