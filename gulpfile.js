// Load plugins
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({camelize: true});
var browserSync = require('browser-sync');

// Styles
gulp.task('styles', function(){
  return gulp.src('./src/sass/*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.sass())
    .pipe(gulp.dest('./dist'))

    .pipe(browserSync.reload({stream:true}));
});

// JavaScript
gulp.task('js', function(){
  return gulp.src('./src/js/*.js')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./dist/js'))

    .pipe(browserSync.reload({stream:true}));
});

//Images
gulp.task('images', function(){
  return gulp.src('./src/img/**/*')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./dist/img'))

    .pipe(browserSync.reload({stream:true}));
});

//Html
gulp.task('html', function(){
  return gulp.src('./src/html/**/*')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./dist'))

    .pipe(browserSync.reload({stream:true}));
});

// browserbrowser-sync
gulp.task("bs", function() {
  browserSync(
    {server: {
            baseDir: "./dist/"
        }
  });
});

// Watch
gulp.task('watch', function(){
  // Watch .scss files
  gulp.watch('./src/Sass/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('./src/js/*.js', ['js']);

  // Watch image files
  gulp.watch('./src/img/**/*', ['images']);

  // Watch html
  gulp.watch('./src/html/*.html', ['html']);

});

// Default task
gulp.task('default', ['styles', 'js', 'images', 'html', 'watch', 'bs']);
