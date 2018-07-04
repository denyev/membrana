'use strict';

let gulp = require ('gulp');
let sass = require('gulp-sass');
let plumber = require('gulp-plumber');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let minifyCss = require('gulp-csso');
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let svgstore = require('gulp-svgstore');
let rename = require('gulp-rename');
let server = require('browser-sync').create();
let del = require('del');
let critical = require('critical');
let realFavicon = require ('gulp-real-favicon');
let fs = require('fs');
let htmlminify = require('gulp-htmlmin');
let mqpacker = require('css-mqpacker');
let sourcemaps = require('gulp-sourcemaps');
let gsgc = require('gulp-sass-generate-contents');
let debug = require('gulp-debug');
let run = require('run-sequence');
let rigger = require('gulp-rigger');
let uglify = require('gulp-uglify');

let cnf = {
  creds: {
    'Author': 	'Strogov',
    'Website': 	'strogov.ru'
  },
  build: {
    html:  'dist/',
    css:   'dist/css/',
    js:    'dist/js/',
    img:   'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: {
    html:  'src/*.html',
    scss:  'src/scss/style.scss',
    js:    'src/js/script.js',
    img:   'src/img/**/*.*',
    jpg:   'src/img/**/*.{jpg,jpeg}',
    png:   'src/img/**/*.png',
    gif:   'src/img/**/*.gif',
    ico:   'src/img/**/*.ico',
    svg:   'src/img/**/*.svg',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html:   'src/**/*.html',
    scss:   'src/scss/**/*.scss',
    js:     'src/js/**/*.js'
  },
  clean:    './dist'
};

gulp.task('clean', function () {
  return del(cnf.clean);
});

gulp.task('copy', function (done) {
  return gulp.src([
      'src/*.html',
      'src/fonts/**/*.{woff,woff2}',
      'src/css/**/*.css',
      'src/libs/**/*',
      'src/js/**/*.js',
      'src/img/**/*.{jpg,jpeg,png,gif,svg,ico}'
    ], {
      base: 'src'
    })
    // .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(gulp.dest('dist'));
    console.log(done.event);
});

gulp.task('toc', function () {
  gulp.src([
    'src/scss/style.scss',
    'src/scss/_blocks/**/*.scss'
  ])
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(gsgc('src/scss/style.scss', creds))
    .pipe(gulp.dest('src/scss/'));
});

gulp.task('style', function() {
  return gulp.src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'node_modules'
      ]
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      mqpacker()
    ]))
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCss())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(server.stream());
});

gulp.task('style:font', function() {
  return gulp.src('src/css/font/font.css')
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('dist/css/font'))
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css/font'))
    .pipe(server.stream());
});

gulp.task('style:all', function (done) {
  run(
    'style:font',
    'style',
    done
  )
});

gulp.task('critical', function () {
  critical.generate({
    inline: true,
    base: '.',
    src: 'dist/index.html',
    css: ['dist/css/style.css'],
    dimensions: [{
      height: 320,
      width: 480
    }, {
      height: 720,
      width: 1280
    }],
    dest: 'dist/index.html',
    minify: true,
    extract: true,
    timeout: 30000
  });
});

gulp.task('js', function() {
  gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build.js))
    .pipe(server.reload({stream: true}));
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(debug())
    .pipe(htmlminify({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('htmlmin', function() {
  return gulp.src('dist/*.html')
    .pipe(plumber())
    .pipe(debug())
    .pipe(htmlminify({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('server', function() {
  server.init({
    server: 'dist/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(
    'src/css/**/*.css',
    ['style:all']
  );

  gulp.watch(
    'src/scss/**/*.scss',
    ['style']
  );

  gulp.watch('dist/css/**/*.css')
    .on('change', server.reload);

  gulp.watch(
    'src/**/*.html',
    [
      'htmlmin',
      'html'
    ]
  );

  gulp.watch('dist/**/*.html')
    .on('change', server.reload);
});

gulp.task('build', function (done) {
  run(
    'clean',
    'copy',
    'style:all',
    'html',
    'htmlmin',
    'server',
    done
  )
});
