/* global module */

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['lib/**/*.js'],
                dest: '<%= pkg.name %>.js'
            }
        },
        yuidoc: {
            all: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
//        url: '<%= pkg.homepage %>',
                options: {
                    paths: ['./', 'lib/'],
		    exclude: 'dist,build,doc',
                    outdir: 'doc/'
                }
            }
        },
        jshint: {
            all: ['dist/<%= pkg.name %>.js']
        },

        mochaTest: {
          test: {
            options: {
              reporter: 'spec',
              captureFile: 'results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
            src: ['test/**/*.js']
          }
        },

        env: {
          coverage: {
            APP_DIR_FOR_CODE_COVERAGE: '../coverage/instrument/lib/'
          }
        },

        instrument: {
          files: 'lib/*.js',
          options: {
            lazy: true,
            basePath: 'coverage/instrument/'
          }
        },

        storeCoverage: {
          options: {
            dir: 'coverage/reports'
          }
        },
       
        makeReport: {
          src: 'coverage/reports/**/*.json',
          options: {
            type: 'cobertura',
            dir: 'coverage/reports',
            print: 'detail'
          }
        },
 
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Copyright by <%= pkg.author.name %> <%= pkg.author.email %> */\n'
            },
            build: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('check', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['concat', 'jshint', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport']);
    grunt.registerTask('jenkins', ['concat', 'jshint', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport', 'uglify']);
    grunt.registerTask('default', ['concat', 'jshint', 'mochaTest', 'yuidoc', 'uglify']);
};
