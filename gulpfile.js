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
  scripts: {
    all: 'source/js/**/*.js',
    modules: [
      'source/js/apps/popup/app.js',
      'source/js/apps/background/app.js',
      'source/js/apps/options/app.js'
    ]
  },
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

var build = {
  root: 'build',
  js: 'build/js',
  css: 'build/css',
  img: 'build/img',
  fonts: 'build/fonts'
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
    .pipe(gulp.dest(build.img))
    .pipe($.size({ title: 'images' }));
});

gulp.task('images:vendor', function() {
  if (!files.vendorImages.length) {
    $.util.log(chalk.magenta('No vendor images. Skipping.'));
    return;
  }

  return gulp.src(files.vendorImages)
    .pipe(gulp.dest(build.img))
    .pipe($.size({ title: 'vendorImages' }));
});

gulp.task('fonts', [ 'fonts:vendor' ], function() {
  return gulp.src(files.fonts)
    .pipe(gulp.dest(build.fonts))
    .pipe($.size({ title: 'fonts' }));
});

gulp.task('fonts:vendor', function() {
  if (!files.vendorFonts.length) {
    $.util.log(chalk.magenta('No vendor fonts. Skipping.'));
    return;
  }

  return gulp.src(files.vendorFonts)
    .pipe(gulp.dest(build.fonts))
    .pipe($.size({ title: 'vendorFonts' }));
});

gulp.task('styles', [ 'scsslint', 'styles:vendor' ], function() {
  return gulp.src(files.styles)
    .pipe($.rubySass(config.sass))
    .on('error', function(err) { $.util.log(chalk.red(err)); })
    .pipe(gulp.dest(build.css))
    .pipe($.size({ title: 'styles' }));
});

gulp.task('styles:vendor', function() {
  if (!files.vendorCSS.length) {
    $.util.log(chalk.magenta('No vendor styles. Skipping.'));
    return;
  }

  return gulp.src(files.vendorCSS)
    .pipe(gulp.dest(build.css))
    .pipe($.size({ title: 'vendorStyles' }));
});

gulp.task('scsslint', function() {
  return gulp.src(files.styles)
    .pipe($.scsslint('.scss-lint.yml'))
    .pipe($.scsslint.reporter());
});

gulp.task('html', function() {
  return gulp.src(files.html)
    .pipe(gulp.dest(build.root))
    .pipe($.size({ title: 'html' }));
});

var compileModule = function(input, intermediate, sourcemap) {
  return function() {
    return gulp.src(input)
      .pipe($.browserify(config.browserify))
      .pipe(transform(function() { return exorcist(intermediate); }))
      .pipe($.if(isProduction, $.uglifyjs({
        inSourceMap: intermediate,
        outSourceMap: sourcemap
      })))
      .pipe($.size({ title: path.basename(input) }))
      .pipe(gulp.dest(build.js));
  };
};

gulp.task('scripts:popup', compileModule(
  'source/js/apps/popup/app.js',
  'build/js/apps/popup/app.browserify.map',
  'build/js/apps/popup/app.js.map'
));

gulp.task('scripts:options', compileModule(
  'source/js/apps/options/app.js',
  'build/js/apps/options/app.browserify.map',
  'build/js/apps/options/app.js.map'
));

gulp.task('scripts:background', compileModule(
  'source/js/apps/background/app.js',
  'build/js/apps/background/app.browserify.js',
  'build/js/apps/background/app.js.map'
));

gulp.task('scripts', function() {
  return runSequence([ 'scripts:vendor', 'scripts:popup', 'scripts:options', 'scripts:background' ]);
});

gulp.task('scripts:vendor', function() {
  if (!files.vendorJS.length) {
    $.util.log(chalk.magenta('No vendor JS. Skipping.'));
    return;
  }

  return gulp.src(files.vendorJS)
    .pipe(gulp.dest(build.js))
    .pipe($.size({ title: 'vendorJS' }));
});

gulp.task('totalsize', function() {
  return gulp.src('build/**/*')
    .pipe($.size({ title: 'totalSize' }));
});

gulp.task('manifest', function() {
  return gulp.src('source/manifest.json')
    .pipe(gulp.dest('build'));
});

gulp.task('default', function() {
  return runSequence([ 'html', 'styles', 'scripts', 'fonts', 'images' ], 'totalsize');
});

module.exports = gulp;
