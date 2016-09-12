/* jshint node: true */
'use strict';

var _ = require('lodash'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),    // Mangle and compress JavaScript
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    es2015 = require('babel-preset-es2015'),
    gulpIf = require('gulp-if');

var javascriptDefaults = {
    name: 'javascript'
};


module.exports = function (gulp, options) {
    var javascriptOptions = {},
        paths = options.paths;

    // Set options
    _.merge(javascriptOptions, javascriptDefaults, options.javascript);

    gulp.task(javascriptOptions.name, function () {
        return gulp.src(options.paths.src.js, {base: './'})
        .pipe(gulpIf(options.mode === 'development', sourcemaps.init())) // Don't create sourcemaps in production
        .pipe(babel({
            presets: [es2015]
        }))
        .pipe(gulpIf(options.mode !== 'development', uglify())) // Don't uglify code in development
        .pipe(rename(function (path) {  // Replace the source paths with destination ones
            path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement);
        }))
        .pipe(gulpIf(options.mode === 'development', sourcemaps.write())) // Don't create sourcemaps in production
        .pipe(gulp.dest('./'))
        .on('end', browserSync.reload);
    });

    gulp.task(javascriptOptions.name + ':watch', function () {
        gulp.watch(paths.src.js, [javascriptOptions.name]);     // TODO consider changing to gulp-watch so new files are detected
    });
};
