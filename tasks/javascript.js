'use strict';

var args = require('yargs').argv,   // Pass agruments using the command line
    passthrough = require('gulp-empty'),
    merge = require('merge'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),    // Mangle and compress JavaScript
    sourcemaps = require('gulp-sourcemaps');


// Production / development specific changes
if (args.dev || args.develop) {
    // Don't uglify code in development
    uglify = passthrough;
} else {
    // Don't create sourcemaps in production
    sourcemaps = {
        init: passthrough,
        write: passthrough
    };
}


module.exports = function (gulp, options) {
    // Set options
    var paths = options.paths;

    gulp.task('javascript', function () {
        return gulp.src(options.paths.src.js)
            .pipe(sourcemaps.init())
            .pipe(uglify())    // Uglify if not in dev mode
            .pipe(rename(function (path) {  // Replace the source paths with destination ones
                path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement)
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./'))
    });

    gulp.task('javascript:watch', function () {
        gulp.watch(paths.src.js, ['javascript']);     // TODO consider changing to gulp-watch so new files are detected
    });
};
