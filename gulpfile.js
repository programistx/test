var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var beep = require('beepbeep');
var jshint = require('gulp-jshint');

gulp.task('sass', function(done) {
  gulp.src("./app/sass/main.scss")
    .pipe(sass().on('error', notify.onError()))
    .pipe(autoprefixer(['last 3 versions']),
    {cascade: false})
    .pipe(gulp.dest("./app/css"))
    .pipe(browserSync.stream());
  done();
});

gulp.task('serve', function(done) {
  browserSync.init({
    server: "./app"
  });
  gulp.watch("./app/sass/*.scss", gulp.series('sass'));
  gulp.watch("./app/*.html").on('change', () => {
    browserSync.reload();
    done();
  });
  done();
});

gulp.task('mincss', function(done) {
  gulp.src("./app/css/*.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/css"))
  done();
});

gulp.task('minjs', function(done) {
  gulp.src("./app/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {beep: true}))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"))
  done();
});

gulp.task('minimage', function(done) {
  gulp.src("./app/img/*.png")
  .pipe(cache(imagemin([ 
    imagemin.gifsicle({interlaced: true}),
    pngquant(),
    imagemin.svgo({plugins: [{removeViewBox: false}]})
  ])))
  .pipe(gulp.dest('./dist/img'))
  done();
});

gulp.task('fonts', function(done) {
  gulp.src("./app/fonts/*.*")
  .pipe(gulp.dest("./dist/fonts"));
  done();
});

gulp.task('html', function(done) {
  gulp.src("./app/*.html")
  .pipe(gulp.dest("./dist"));
  done();
});

gulp.task('watch', gulp.series('sass', 'serve'));
gulp.task('build', gulp.series('sass', 'fonts', 'html', 'mincss', 'minjs', 'minimage'))
