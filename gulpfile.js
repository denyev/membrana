'use strict';

let gulp = require ("gulp");
let sass = require("gulp-sass");
let plumber = require("gulp-plumber");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let minify = require("gulp-minify");
let minifyCss = require("gulp-cssnano");
let imagemin = require("gulp-imagemin");
let webp = require("gulp-webp");
let svgstore = require("gulp-svgstore");
let rename = require("gulp-rename");
let server = require("browser-sync").create();
let run = require("run-sequence");
let del = require("del");
let critical = require('critical');
let realFavicon = require ('gulp-real-favicon');
let fs = require('fs');
let htmlminify = require('gulp-htmlmin');
let mqpacker = require("css-mqpacker");
let sourcemaps = require('gulp-sourcemaps');
let access = require('gulp-accessibility');
let gsgc = require("gulp-sass-generate-contents");

let creds = {
  "Author": 	"Strogov",
  "Website": 	"strogov.ru"
}

gulp.task("clear", function () {
  return del("dist");
});

gulp.task("copy", function () {
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
    .pipe(plumber())
    .pipe(gulp.dest("dist"));
});

gulp.task('gulp-sass-generate-contents', function () {
  gulp.src([
    "src/scss/style.scss",
    "src/scss/_blocks/**/*.scss"
  ])
    .pipe(gsgc('src/scss/style.scss', creds))
    .pipe(gulp.dest('src/scss/'));
});

gulp.task("font", function() {
  return gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(sass())
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

gulp.task("style", function() {
  return gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(sass())
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
