'use strict';

let gulp = require ("gulp");
let sass = require("gulp-sass");
let plumber = require("gulp-plumber");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let minifyCss = require("gulp-cssnano");
let imagemin = require("gulp-imagemin");
let webp = require("gulp-webp");
let svgstore = require("gulp-svgstore");
let rename = require("gulp-rename");
let server = require("browser-sync").create();
let del = require("del");
let critical = require('critical');
let realFavicon = require ('gulp-real-favicon');
let fs = require('fs');
let htmlminify = require('gulp-htmlmin');
let mqpacker = require("css-mqpacker");
let sourcemaps = require('gulp-sourcemaps');
let gsgc = require("gulp-sass-generate-contents");
let debug = require("gulp-debug");
var run = require('run-sequence');

let creds = {
  "Author": 	"Strogov",
  "Website": 	"strogov.ru"
}

gulp.task("clean", function () {
  return del("dist");
});

gulp.task("copy", function (done) {
  return gulp.src([
      "src/*.html",
      "src/fonts/**/*.{woff,woff2}",
      "src/css/**/*.css",
      "src/libs/**/*",
      "src/js/**/*.js",
      "src/img/**/*.{jpg,jpeg,png,gif,svg,ico}"
    ], {
      base: "src"
    })
    // .pipe(plumber())
    .pipe(debug({
      minimal: "false"
    }))
    .pipe(gulp.dest("dist"));
    done();
});

gulp.task('toc', function () {
  gulp.src([
    "src/scss/style.scss",
    "src/scss/_blocks/**/*.scss"
  ])
    .pipe(plumber())
    .pipe(debug({
      minimal: "false"
    }))
    .pipe(gsgc('src/scss/style.scss', creds))
    .pipe(gulp.dest('src/scss/'));
});

gulp.task("font", function() {
  return gulp.src("src/scss/font/_font.scss")
    .pipe(plumber())
    .pipe(debug({
      minimal: "false"
    }))
    // .pipe(sass()).on('error', sass.logError)
    .pipe(postcss([
      autoprefixer(),
      mqpacker()
    ]))
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(rename("font.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("style", function() {
  return gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(debug({
      minimal: "false"
    }))
    .pipe(sass()).on('error', sass.logError)
    .pipe(postcss([
      autoprefixer(),
      mqpacker()
    ]))
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("critical", function () {
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

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(plumber())
    .pipe(debug())
    .pipe(htmlminify({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest("dist"));
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

gulp.task("server", function() {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch(
    "src/css/**/*.css",
    ["style"]
  ).on("change", server.reload);
  gulp.watch(
    "src/*.html",
    ["htmlmin"],
    ["html"]
  ).on("change", server.reload);
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "html",
    "htmlmin",
    done
  )
});
