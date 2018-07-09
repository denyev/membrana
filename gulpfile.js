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
let svgmin = require('gulp-svgmin');
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
let base64 = require('gulp-base64');
let inject = require('gulp-inject');

let cnf = {
  creds: {
    'Author': 'Strogov',
    'Website': 'strogov.ru'
  },
  build: {
    all: 'dist/',
    path: 'dist/public/',
    css: 'dist/public/css/',
    fontcss: 'dist/public/css/font',
    js: 'dist/public/js/',
    img: 'dist/public/img/',
    fonts: 'dist/public/fonts/'
  },
  src: {
    path: 'src',
    html: 'src/*.html',
    scss: 'src/scss/style.scss',
    blocks: 'src/scss/_blocks/**/*.scss',
    css: 'src/css/**/*.css',
    fontcss: 'src/css/font/font.css',
    fonts: 'src/fonts/**/*.*',
    libs: 'src/libs/**/*',
    js: {
      path: 'src/js/',
      all: 'src/js/*.js',
      main: 'src/js/script.js',
      vendor: 'src/js/vendor.js',
      ripple: 'node_modules/@material/ripple/index.js'
    },
    img: {
      all: 'src/img/**/*.*',
      path: 'src/img/',
      jpg: 'src/img/**/*.{jpg,jpeg}',
      png: 'src/img/**/*.png',
      gif: 'src/img/**/*.gif',
      ico: 'src/img/**/*.ico',
      svg: 'src/img/**/*.svg',
      webp: 'src/img/**/*.webp'
    },
    assets: {
      all: './src/assets/**/*.*',
      path: './src/assets/',
      img: {
        all: './src/assets/img/**/*.*',
        path: './src/assets/img/',
        jpg: 'src/assets/img/**/*.{jpg,jpeg}',
        png: 'src/assets/img/**/*.png',
        gif: 'src/assets/img/**/*.gif',
        ico: 'src/assets/img/**/*.ico',
        svg: 'src/assets/img/**/*.svg',
        webp: 'src/assets/img/**/*.webp'
      }
    }
  },
  watch: {
    dist: {
      html: 'dist/**/*.html',
      css: 'dist/css/**/*.css',
      js: 'dist/js/**/*.js'
    },
    src: {
      html: 'src/**/*.html',
      scss: 'src/scss/**/*.scss',
      css: 'src/scss/**/*.css',
      js: 'src/js/**/*.js'
    }
  },
  clean: {
    all: './dist',
    build: './dist/public/'
    // assets: './src/assets/'
  },
  minify: {
    css: {
      restructure: true,
      comments: false,
      debug: true
    }
  },
  base64: {
    baseDir: './src/',
    // exclude: ['*.svg*'],
    // maxImageSize: 8*1024,
    debug: true
  }
};

gulp.task('clean:all', function (done) {
  run(
    'clean:assets',
    'clean:build',
    done
  );
});

gulp.task('clean:build', function () {
  return del(cnf.clean.build);
});

gulp.task('clean:assets', function () {
  return del(cnf.clean.assets);
});

gulp.task('copy:all', function (done) {
  return gulp.src([
    cnf.src.html,
    cnf.src.fonts,
    cnf.src.css,
    cnf.src.libs,
    cnf.src.js.all,
    cnf.src.img.all
  ], {
    base: cnf.src.path
  })
    .pipe(plumber())
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
    .pipe(base64(cnf.base64))
    .pipe(gulp.dest(cnf.build.css))
    .pipe(minifyCss(cnf.minify.css))
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

gulp.task('js:browserify', function () {
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

gulp.task('img:jpg', function () {
  return gulp.src(cnf.src.assets.img.jpg)
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(cnf.src.img.path));

});

gulp.task('img:png', function () {
  return gulp.src(cnf.src.assets.img.png)
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 7})
    ]))
    .pipe(gulp.dest(cnf.src.img.path));
});

gulp.task('svg:sprite', function () {
  return gulp.src(cnf.src.assets.img.svg)
    .pipe(plumber())
    .pipe(debug({
      minimal: 'false'
    }))
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest(cnf.src.img.path));
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
    cnf.watch.src.css,
    ['style:all']
  );

  gulp.watch(
    cnf.watch.src.scss,
    ['style']
  );

  gulp.watch(cnf.watch.dist.css)
    .on('change', server.reload);

  gulp.watch(
    cnf.watch.src.html,
    [
      // 'htmlmin',
      'html'
    ]
  );

  gulp.watch(cnf.watch.dist.html)
    .on('change', server.reload);
});

gulp.task('build', function (done) {
  run(
    'clean:all',
    'img:jpg',
    'img:png',
    'svg:sprite',
    'copy:all',
    'style:all',
    'js:all',
    'html',
    'server',
    done
  );
});
