var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var notify = require('gulp-notify');
var concat = require('gulp-concat'); //合并文件
var rm = require('rimraf');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var imagemin = require('gulp-imagemin');

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var src = './src/';
var dest = './dist/';
var homepage = "index.html";
var config = {
  src: src,
  dest: dest,
  webServer: {
    server: './dist',
    index: homepage,
    port: 3000,
    logLevel: "debug",
    logPrefix: "JHW",
    open: true,
    files: [dest + "/*.js", "./index.html"]
  },
  scss: {
    src: src + '**/*.scss'
  },
  script: {
    entry: {
      'entry': src + 'main.js'
    },
    output: {
      path: dest, //js位置
      filename: 'bundle.js'
    },
    sourceMap: true,
    watch: src + '**/*.js'
  },
  html: {
    watchHome: homepage, //主页
    watchAll: src + '**/*.html', //所有
  }
}

var webpackConfig = require('./webpack.config')(config);
gulp.task('webpack', function() {
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      handleErrors();
    }
  });
});

gulp.task('img:dev', ['clean'], function() {
  return gulp.src([src + '/images/**'])
    .pipe(watch())
    .pipe(reload());
});

gulp.task('img', ['clean'], function() {
  return gulp.src([src + '/images/**'])
    .pipe(imagemin())
    .pipe(gulp.dest(dest + '/images'));
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'compile error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
};

gulp.task('web-server', ['build'],function() {
  browserSync.init(config.webServer);
});

gulp.task('watch', ['web-server'], function() {
  gulp.watch(config.script.watch, ['webpack']).on('change', reload);
  gulp.watch(config.scss.src, ['webpack']).on('change', reload);
  gulp.watch(config.src + '/**/*.vue', ['webpack']).on('change', reload);
  gulp.watch(config.html.watchHome, ['html']).on('change', reload);
  gulp.watch(config.html.watchAll, ['html']).on('change', reload);
});

gulp.task('static', function() {

  return gulp.src([src + 'static/**/*.*'])
    .pipe(gulp.dest(dest + 'static'));
});

gulp.task('html', function() {
  return gulp.src([src + '**/*.html'])
    .pipe(gulp.dest(dest));
});

gulp.task('clean', function(next) {
  rm(dest, function() {
    next();
  });
});

gulp.task('default', ['watch']);

gulp.task('build', ['webpack', 'img', 'static', 'html']);
