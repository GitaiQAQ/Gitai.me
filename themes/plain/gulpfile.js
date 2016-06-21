'use strict';

var gulp     = require('gulp');
var stylus     = require('gulp-stylus');
var mincss   = require('gulp-clean-css');
var prefixer = require('gulp-autoprefixer');
var rimraf   = require('rimraf');

gulp.task('clean', function (done) {
  rimraf('./source/css/main.css', done);
});

// Compile Sass into CSS
gulp.task('stylus', function () {
  gulp.src('./style/style.styl')
      .pipe(stylus())
      .pipe(prefixer('last 3 versions'))
      //.pipe(mincss())
      .pipe(gulp.dest('./source/css'));
});

// Watch for changes to Sass
gulp.task('watch', function () {
  gulp.watch('./style/**/*.styl', ['stylus']);
});

gulp.task('build', ['clean', 'stylus']);

gulp.task('default', ['build', 'watch']);
