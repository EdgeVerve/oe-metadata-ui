/**
 *
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

module.exports = function GruntConfig(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      coverage: {
        src: ['coverage/']
      },
      dist: {
        src: ['dist/']
      }
    },

    mocha_istanbul: {
      options: {
        mochaOptions: ['--exit']
      },
      coverage: {
        src: ['test/test.js', 'test/scripts/*.js'],
        options: {
          timeout: 60000,
          check: {
            lines: 90,
            statements: 90,
            branches: 50,
            functions: 98
          },
          reportFormats: ['lcov']
        }
      }
    }
  });

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test-with-coverage', ['clean:coverage', 'mocha_istanbul']);
};
