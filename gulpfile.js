const gulp = require('gulp');
const uglifyES = require('uglify-es');
const composer = require('gulp-uglify/composer');
const concat = require('gulp-concat');
const del = require('del');
const uglify = composer(uglifyES, console);

const clean = () => del(['dist/*']);

const buildNormal = () => {
  return gulp.src('./dist/countUp.js')
    .pipe(concat('countUp.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
}

const buildLegacy = () => {
  return gulp.src([
      './requestAnimationFrame.polyfill.js',
      './dist/countUp.js'
    ])
    .pipe(concat('countUp.withPolyfill.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
}

gulp.task('clean', clean);
const build = gulp.series(buildNormal, buildLegacy);
gulp.task('build', build);

exports.clean = clean;
exports.default = build;
