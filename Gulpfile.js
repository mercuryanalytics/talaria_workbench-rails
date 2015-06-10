var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    es6transpiler = require('gulp-es6-transpiler'),
    moduleTranspiler = require('gulp-es6-module-transpiler'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

gulp.task('scripts', function() {
  return gulp.src('src/javascripts/talaria-workbench.js')
    .pipe(sourcemaps.init())
    // .pipe(moduleTranspiler({ formatter: 'bundle' }))
    .pipe(es6transpiler())
    .pipe(gulp.dest('vendor/assets/javascripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('vendor/assets/javascripts'))
});

gulp.task('clean', function(cb) {
  del(['vendor/assets/javascripts'], cb);
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts');
});

gulp.task('watch', function() {
  gulp.watch('src/javascripts/**/*.js', ['scripts']);
});
