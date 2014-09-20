/**
 * Hayfever for Chrome
 * Project Gulpfile
 */

/* jshint -W097 */

'use strict';

var gulp        = require('gulp');
var _           = require('lodash');
var $           = require('gulp-load-plugins')({ lazy: true });
var fs          = require('fs');
var path        = require('path');
var del         = require('del');
var runSequence = require('run-sequence');
var pngcrush    = require('imagemin-pngcrush');
var chalk       = require('chalk');
var exorcist    = require('exorcist');
var transform   = require('vinyl-transform');
var glob        = require('glob');

var isProduction = true;

if ($.util.env.dev) {
  isProduction = false;
}

var config = {
  browserify: {
    insertGlobals: !isProduction,
    debug: true
  },
  sass: {
    style: isProduction ? 'compressed' : 'expanded',
    lineNumbers: !isProduction,
    precision: 10,
    loadPath: [
      'source/css'
    ]
  }
};

var files = {
  scripts: 'source/js/**/*.js',
  styles: 'source/css/**/*.scss',
  vendorCSS: [
    'node_modules/font-awesome/css/*.css'
  ],
  vendorJS: [],
  vendorImages: [],
  images: 'source/img/**/*',
  fonts: 'source/fonts/**/*',
  vendorFonts: [
    'node_modules/font-awesome/fonts/*'
  ],
  packageJSON: './package.json',
  html: 'source/**/*.html'
};

gulp.task('help', $.helptext({
  'help': 'this message',
  'default': 'build everything',
  'watch': 'watch files and build as needed',
  'styles': 'compile sass stylesheets',
  'scripts': 'compile and concat browserify modules',
  'html': 'copy and process html files',
  'images': 'copy and optimize images',
  'clean': 'delete all the thngs. actually just ./build',
  'bump:major': 'increment major version',
  'bump:minor': 'increment minor version',
  'bump:patch': 'increment patch version',
  'zip': 'create a compressed archive of buid for submission to google'
}));

gulp.task('watch', function() {
  gulp.watch(files.styles, [ 'styles' ]);
  gulp.watch(files.scripts, [ 'scripts' ]);
  gulp.watch(files.images, [ 'images' ]);
  gulp.watch(files.html, [ 'html' ]);
  gulp.watch(files.fonts, [ 'fonts' ]);
});

gulp.task('images', [ 'images:vendor' ], function() {
  return gulp.src(files.images)
    .pipe($.cache($.imagemin({
      progressive: true,
      svgoPlugins: [ { removeViewBox: false } ],
      use: [ pngcrush() ]
    })))
    .pipe(gulp.dest('build/img'))
    .pipe($.size({ title: 'images' }));
});

gulp.task('images:vendor', function() {
  if (!files.vendorImages.length) {
    $.util.log(chalk.magenta('No vendor images. Skipping.'));
    return;
  }

  return gulp.src(files.vendorImages)
    .pipe(gulp.dest('build/img'))
    .pipe($.size({ title: 'vendorImages' }));
});

gulp.task('fonts', [ 'fonts:vendor' ], function() {

});

gulp.task('fonts:vendor', function() {

});

gulp.task('styles', [ 'scsslint', 'styles:vendor' ], function() {

});

gulp.task('styles:vendor', function() {

});

gulp.task('scsslint', function() {

});

gulp.task('scripts', [ 'scripts:vendor' ], function() {

});

gulp.task('scripts:vendor', function() {

});
