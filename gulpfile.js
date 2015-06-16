var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var nodemon = require('gulp-nodemon');
var nodeInspector = require('gulp-node-inspector');

var frontendScripts = 'assets/**/*.js';

var nodemonConfig = {
  script: './bin/www',
  tasks: ['scripts']
};

gulp.task('default', ['scripts']);

gulp.task('start', function() {
  nodemonConfig['exec'] = 'node --use-strict --harmony-classes';
  nodemon(nodemonConfig);
});

gulp.task('debug', function() {
  gulp.src([]).pipe(nodeInspector());

  nodemonConfig['exec'] = 'node --debug --use-strict --harmony-classes';
  nodemon(nodemonConfig);
});

gulp.task('scripts', function() {
  return gulp.src(frontendScripts)
      .pipe(cached('scripts'))
      .pipe(jshint())
      .pipe(header('(function () {'))
      .pipe(footer('})();'))
      .pipe(remember('scripts'))
      .pipe(concat('game.js'))
      .pipe(gulp.dest('public/javascripts'));
});

gulp.task('watch', function () {
  var watcher = gulp.watch(frontendScripts, ['scripts']);

  watcher.on('change', function (event) {
    if (event.type === 'deleted') {
      delete cached.caches.scripts[event.path];
      remember.forget('scripts', event.path);
    }
  });
});
