'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var shrink = require('gulp-cssshrink');
var minifyHTML = require('gulp-minify-html');
var Imagemin = require('imagemin');
var sass = require('gulp-sass');
var clean = require('gulp-clean');


// 静态文件打包合并
var webpack = require('gulp-webpack');



// MD5戳
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence');

var config = require('./webpack.config');



gulp.task('js', function () {
  return gulp.src(['./js/*.js'])
    //.pipe(concat('app.js'))
    .pipe(webpack(config))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./dist/js/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/js'));
});





gulp.task('image', function () {
  new Imagemin()
      .src('images/*.{gif,jpg,png,svg}')
      .dest('dist/images')
      .use(Imagemin.jpegtran({progressive: true}))
      .use(Imagemin.optipng({optimizationLevel: 3}))
      .run(function (err, files) {
         // console.log(files[0]);
         
      });
});


gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});



gulp.task('data', function () {
  return gulp.src(['./data/*'])
  
    .pipe(gulp.dest('./dist/data'));
});




gulp.task('css', function () {
  return gulp.src(['./css/app.css'])
    .pipe(shrink())
    .pipe(rev())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/css'));
});
gulp.task('watch', function () {
  gulp.watch('./css/*.css', ['css']);
  gulp.watch('./js/*.js', ['js']);
});
gulp.task('html', function () {
  return gulp.src(['./dist/rev/**/*.json', './index.html','./comment.html','./pingjia.html'])
    .pipe( minifyHTML({
                empty:true,
                spare:true
            }) )
    .pipe(revCollector({
      dirReplacements: {
        'css':'css',
        'js':'js',
        'build/': ''
      }
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('publish', function (callback) {
  runSequence( ['css', 'js','data','image'],  'html',  callback);
});
