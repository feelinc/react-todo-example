var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('browserify', function() {
  gulp.src('src/js/app.js')
    .pipe(browserify({transform: 'reactify'}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('compress', function() {
  gulp.src('dist/js/app.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserify', 'copy']);
gulp.task('build', ['browserify', 'compress', 'copy']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});