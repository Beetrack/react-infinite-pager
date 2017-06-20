import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import gutil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import babelify from 'babelify';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const dependencies = [
  'react',
  'react-dom'
];

let scriptsCount = 0;

gulp.task('scripts', () => {
  bundleApp(false);
});

gulp.task('deploy', () => {
  bundleApp(true);
});

gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
    './src/styles/main.scss'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./docs/css/'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('default', ['styles', 'scripts'], () => {
  const src = './src/';
  browserSync({
    notify: false,
    server: ['.tmp', './'],
    port: 3000
  });

  gulp.watch(['./index.html'], [reload]);
  gulp.watch(['**/*.js', '**/*.jsx'], {cwd: src}, ['scripts', reload]);
  gulp.watch(['./docs/js/index.js'], ['scripts', reload]);
  gulp.watch(['./src/**/*.scss'], ['styles', reload]);
});

function bundleApp(isProduction) {
  scriptsCount++;
  var appBundler = browserify({
      entries: './docs/js/index.js',
      debug: true
    })

    if (!isProduction && scriptsCount === 1){
      browserify({
      require: dependencies,
      debug: true
    })
      .bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulp.dest('./docs/js/'));
    }
    if (!isProduction){
      dependencies.forEach(function(dep){
        appBundler.external(dep);
      })
    }

    appBundler
      .transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .on('error',gutil.log)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./docs/js/'));
}