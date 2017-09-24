var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

//Live re-loading browser sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'project'
    }
  })
});

// SASS
gulp.task('sass', function() {
	return gulp.src('project/scss/**/*.scss')
    	.pipe(sass())
		.pipe(gulp.dest('project/css'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
  gulp.watch('project/scss/**/*.scss', ['sass']);
});

// Default task
gulp.task('default', ['watch', ['browserSync']]);