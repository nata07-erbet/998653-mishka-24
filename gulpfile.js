import gulp from "gulp";
import plumber from "gulp-plumber";
import imagemin from "gulp-imagemin";
import terser from "gulp-terser";
import rename from "gulp-rename";
import csso from "gulp-csso";
import sourcemap from "gulp-sourcemaps";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import {create} from "browser-sync";
import webp from "gulp-webp";
import svgstore from "gulp-svgstore";
import htmlmin from "gulp-htmlmin";
import del from "del";
const sync = create();
// Styles

export const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init({}))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

// exports.styles = styles;

export const stylesCopy = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
}

// exports.stylesCopy = stylesCopy;

// Script

export const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

// exports.scripts = scripts;

// Images

export const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([]))
    .pipe(gulp.dest("build/img"));
}

// exports.images = images;

// Webp

export const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
}

// exports.webp = createWebp;

// Sprite

export const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

// exports.sprite = sprite;

// Copy

export const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

// exports.copy = copy;

// Clean

export const clean = () => {
  return del("build");
}

// exports.clean = clean;

// HTML

export const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"))
  .pipe(sync.stream());
}

// exports.html = html;

// Server

export const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build/'
    },
    open: true,
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// exports.server = server;

// Reload

export const reload = () => {
  server.reload();
  done();
}

// exports.reload = reload;

// Watcher

export const watcher = () => {
  gulp.watch("source/sass/**/*.scss", {delay: 550}, gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series("html", "reload"));
  gulp.watch("source/img/sprite/*.svg", gulp.series("sprite", "html", "reload"));
  gulp.watch("source/img/*.{png,jpg}", gulp.series("images", "createWebp", "reload"));
  gulp.watch("source/css/*.css", gulp.series("styles"));
}

export const build = gulp.series(
  clean,
  copy,
  stylesCopy,
  styles,
  scripts,
  images,
  createWebp,
  sprite,
  html
);

export const start = gulp.series(
  clean,
  copy,
  stylesCopy,
  styles,
  scripts,
  images,
  createWebp,
  sprite,
  html,
  server,
  watcher
);
