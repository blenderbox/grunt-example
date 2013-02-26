'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // Configure your paths
    blenderbox: {
      app: 'app',
      dist: 'dist'
    },

    // This will watch files for changes, and run commands when they do
    watch: {
      compass: {
        files: ['<%= blenderbox.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= blenderbox.app %>/*.html',
          '{.tmp,<%= blenderbox.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= blenderbox.app %>}/scripts/{,*/}*.js',
          '<%= blenderbox.app %>/images/{,*/}*.{png,jpg,jpeg,webp}'
        ],
        tasks: ['livereload']
      }
    },

    // This task runs a web server
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,  // Magic auto-reload javascript injection
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },

    // Deletes files and directories
    clean: {
      dist: ['.tmp', '<%= blenderbox.dist %>/*'],
      server: '.tmp'
    },

    // Makes sure your js files are clean
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= blenderbox.app %>/scripts/{,*/}*.js',
        '!<%= blenderbox.app %>/scripts/vendor/*'
      ]
    },

    // Sass & Compass
    compass: {
      options: {
        sassDir: '<%= blenderbox.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= blenderbox.app %>/images',
        javascriptsDir: '<%= blenderbox.app %>/scripts',
        fontsDir: '<%= blenderbox.app %>/styles/fonts',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Combines files into one
    concat: {
      dist: {}  // More magic
    },

    // Makes your javascript files hideous for speed
    uglify: {
      dist: {
        files: {
          '<%= blenderbox.dist %>/scripts/main.js': [
            '<%= blenderbox.app %>/scripts/{,*/}*.js'
          ],
        }
      }
    },

    // Looks at an html file for cues, and replaces assets with minified vers
    useminPrepare: {
      html: '<%= blenderbox.app %>/index.html',
      options: {
        dest: '<%= blenderbox.dist %>'
      }
    },
    usemin: {
      html: ['<%= blenderbox.dist %>/{,*/}*.html'],
      css: ['<%= blenderbox.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= blenderbox.dist %>']
      }
    },
    // Extra image compression
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= blenderbox.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= blenderbox.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= blenderbox.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= blenderbox.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*
           * These are commented out, because many of them will screw up your
           * html. I can show you how to make it work, but minifying your
           * html doesn't pay off that well, and can make it tricky to find
           * issues since Chrome and other browsers will auto close missing
           * tags in the console, along with other sneaky fixes.
           *
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
          */
        },
        files: [{
          expand: true,
          cwd: '<%= blenderbox.app %>',
          src: '*.html',
          dest: '<%= blenderbox.dist %>'
        }]
      }
    },

    // Exactly what it sounds like
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= blenderbox.app %>',
          dest: '<%= blenderbox.dist %>',
          src: ['*.{ico,txt}', 'images/{,*/}*.gif']
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
       'clean:server',
       'compass:server',
       'livereload-start',
       'connect:livereload',
       'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'htmlmin',
    'concat',
    'cssmin',
    'uglify',
    'copy',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
