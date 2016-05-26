/* jshint node: true */
'use strict';

var _ = require('lodash'),
    passthrough = require('gulp-empty'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),    // Mangle and compress JavaScript
    sourcemaps = require('gulp-sourcemaps');

var javascriptDefaults = {
    name: 'javascript'
};


module.exports = function (gulp, options) {
    var javascriptOptions = {},
        paths = options.paths;

    // Set options
    _.merge(javascriptOptions, javascriptDefaults, options.javascript);

    // Production / development specific changes
    if (options.mode === 'development') {
        // Don't uglify code in development
        uglify = passthrough;
    } else {
        // Don't create sourcemaps in production
        sourcemaps = {
            init: passthrough,
            write: passthrough
        };
    }

    gulp.task(javascriptOptions.name, function () {
        return gulp.src(options.paths.src.js)
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename(function (path) {  // Replace the source paths with destination ones
                path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement);
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./'));
    });

    gulp.task(javascriptOptions.name + ':watch', function () {
        gulp.watch(paths.src.js, [javascriptOptions.name]);     // TODO consider changing to gulp-watch so new files are detected
    });
};
