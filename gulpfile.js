var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: 'project'
  });

  gulp.watch('project/scss/*.scss', ['sass']);
  gulp.watch('project/*').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("project/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("project/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);