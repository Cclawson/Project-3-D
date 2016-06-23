//grunt runs default
//grunt build runs build/production version
//dev tasks are for final production
//build tasks are for active development

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                //input of js files
                src: 'public/js/*.js',
                //output combined file
                dest: 'js/script.min.js'
            },
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                //input of js files
                src: 'public/js/*.js',
                //output combined file
                dest: 'js/script.min.js'
            }
        },
        watch: {
            js: {
                files: ['public/js/*.js'],
                tasks: ['uglify:dev']
            }
        },
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },
        mocha: {
            all: {
                src: ['tests/testrunner.html'],
            },
            options: {
                run: true
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch', 'mocha']
        }
    });


    /*Modules*/
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha');

    /*Tasks*/

    //Start Server
    grunt.registerTask('default', ['uglify:dev', 'concurrent']);

    //Uglify
    grunt.registerTask('build', ['uglify:build']);

};