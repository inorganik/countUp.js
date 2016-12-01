var gulp = require('gulp');
var wrap = require('gulp-wrap-umd');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task('clean', function(cb) {
    del(['dist/*']);
    return cb();
});

gulp.task('umd', ['clean'], function(file) {
    var umdCountup = gulp
        .src('countUp.js')
        .pipe(wrap({
        	namespace: 'CountUp',
            exports: 'CountUp'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/'));
    var angularCountup = gulp
        .src('angular-countUp.js')
        .pipe(gulp.dest('dist/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/'));
    var angular2Countup = tsProject
        .src()
        .pipe(tsProject())
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['umd']);
gulp.task('default', ['build']);
