'use strict';

let gulp = require('gulp');
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
let realFavicon = require('gulp-real-favicon');
let fs = require('fs');
let htmlminify = require('gulp-htmlmin');
let mqpacker = require('css-mqpacker');
let sourcemaps = require('gulp-sourcemaps');
let gsgc = require('gulp-sass-generate-contents');
let debug = require('gulp-debug');
let run = require('run-sequence');
let rigger = require('gulp-rigger');
let uglify = require('gulp-uglify-es').default;
let jsImport = require('gulp-js-import');
let browserify = require('browserify');
let babelify = require('babelify');
let concat = require('gulp-concat');

let cnf = {
  creds: {
    'Author': 'Strogov',
    'Website': 'strogov.ru'
  },
  build: {
    path: 'dist/',
    css: 'dist/css/',
    fontcss: 'dist/css/font',
    js: 'dist/js/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: {
    path: 'src',
    html: 'src/*.html',
    scss: 'src/scss/style.scss',
    blocks: 'src/scss/_blocks/**/*.scss',
    css: 'src/css/**/*.css',
    fontcss: 'src/css/font/font.css',
    img: 'src/img/**/*.*',
    jpg: 'src/img/**/*.{jpg,jpeg}',
    png: 'src/img/**/*.png',
    gif: 'src/img/**/*.gif',
    ico: 'src/img/**/*.ico',
    svg: 'src/img/**/*.svg',
    fonts: 'src/fonts/**/*.*',
    libs: 'src/libs/**/*',
    js: {
      path: 'src/js/',
      all: 'src/js/*.js',
      main: 'src/js/script.js',
      vendor: 'src/js/vendor.js',
      ripple: 'node_modules/@material/ripple/index.js'
    }
  },
  watch: {
    html: 'dist/**/*.html',
    scss: 'src/scss/**/*.scss',
    css: 'src/scss/**/*.css',
    js: 'src/js/**/*.js'
  },
  clean: './dist'
};

gulp.task('clean', function () {
  return del(cnf.clean);
});

gulp.task('copy', function (done) {
  return gulp.src([
    cnf.src.html,
    cnf.src.fonts,
    cnf.src.css,
    cnf.src.libs,
    cnf.src.js.all,
    cnf.src.img
  ], {
    base: cnf.src.path
  })
  // .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(gulp.dest(cnf.build.path));
});

gulp.task('toc', function () {
  gulp.src([
    cnf.src.scss,
    cnf.src.blocks
  ])
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(gsgc(cnf.src.scss, cnf.creds))
    .pipe(gulp.dest(cnf.build.css));
});

gulp.task('style', function () {
  return gulp.src(cnf.src.scss)
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
    .pipe(gulp.dest(cnf.build.css))
    .pipe(minifyCss())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(cnf.build.css))
    .pipe(server.stream());
});

gulp.task('style:font', function () {
  return gulp.src(cnf.src.fontcss)
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(cnf.build.fontcss))
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(cnf.build.fontcss))
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

gulp.task('js:browserify', function() {
  return browserify([
      cnf.src.js.ripple
    ])
    .transform(babelify.configure({
      presets: ["es2015"]
    }))
    .bundle()
    .pipe(fs.createWriteStream(cnf.src.js.vendor));
});

gulp.task('js:all', function () {
  gulp.src([
    cnf.src.js.all
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(gulp.dest(cnf.build.js))
    .pipe(jsImport())
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(cnf.build.js))
    .pipe(server.reload({stream: true}));
});

gulp.task('html', function () {
  return gulp.src(cnf.src.html)
    .pipe(plumber())
    .pipe(debug())
    .pipe(htmlminify({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(cnf.build.path));
});

gulp.task('htmlmin', function () {
  return gulp.src(cnf.build.html)
    .pipe(plumber())
    .pipe(debug())
    .pipe(htmlminify({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(cnf.build.path));
});

gulp.task('server', function () {
  server.init({
    server: cnf.build.path,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(
    cnf.watch.css,
    ['style:all']
  );

  gulp.watch(
    cnf.watch.scss,
    ['style']
  );

  gulp.watch(cnf.watch.css)
    .on('change', server.reload);

  gulp.watch(
    cnf.watch.html,
    [
      'htmlmin',
      'html'
    ]
  );

  gulp.watch(cnf.build.html)
    .on('change', server.reload);
});

gulp.task('build', function (done) {
  run(
    'clean',
    'copy',
    'style:all',
    'js:all',
    'html',
    // 'htmlmin',
    'server',
    done
  )
});
