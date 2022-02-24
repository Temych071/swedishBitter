const { src, dest, watch, parallel, series } = require('gulp');

const scss            = require('gulp-sass')(require('sass'));
const concat          = require('gulp-concat');
const autoprefixer    = require('gulp-autoprefixer');
const uglify          = require('gulp-uglify');
const rename          = require('gulp-rename');
const del             = require('del');
const browserSync     = require('browser-sync').create();

function browsersync() {
  browserSync.init({
    server:{
      baseDir: 'assets/'
    },
    notify:false
  });
}

function styles() {
  return src(
    [
      'node_modules/normalize.css/normalize.css',
      'assets/scss/*.scss',
      'assets/fonts/**/*.scss',
    ])
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(rename({
      suffix : '.min'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('assets/css'))
    .pipe(browserSync.stream()) 
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
    'assets/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('assets/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('assets/images/**/*.*')
  
  .pipe(dest('dist/image'))
}

function build() {
  return src([
    'assets/**/*.html',
    'assets/css/style.min.css',
    'assets/js/main.min.js'
  ], {base: 'assets' })
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['assets/scss/**/*.scss'], styles);
  watch(['assets/modules/**/*.scss'], styles);
  watch(['assets/js/**/*.js', '!assets/js/main.min.js'], scripts);
  watch(['assets/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, scripts, browsersync, watching);