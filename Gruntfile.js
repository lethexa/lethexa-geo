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
                src: ['src/main/js/**/*.js'],
                dest: 'target/js/dist/<%= pkg.name %>.js'
            }
        },
        yuidoc: {
            all: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
//        url: '<%= pkg.homepage %>',
                options: {
                    paths: ['src/main/js/'],
                    outdir: 'target/js/doc/'
                }
            }
        },
        jshint: {
            all: ['target/js/dist/<%= pkg.name %>.js']
        },
        
        mochacli: {
          options: {
            reporter: "nyan",
            ui: "tdd"
          },
          all: ["src/test/js/tests.js"]
        },        
        
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Copyright by <%= pkg.author.name %> <%= pkg.author.email %> */\n'
            },
            build: {
                src: 'target/js/dist/<%= pkg.name %>.js',
                dest: 'target/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks("grunt-mocha-cli");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('check', ['jshint']);
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('default', ['concat', 'jshint', 'mochacli', 'yuidoc', 'uglify']);
};
