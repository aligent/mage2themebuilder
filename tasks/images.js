/* jshint node: true */
'use strict';

var _ = require('lodash'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    debug = require('gulp-debug'),
    gulpIf = require('gulp-if');

var imagesDefaults = {
    name: 'images'
};


module.exports = function (gulp, options) {
    var imagesOptions = {},
        paths = options.paths;

    // Set options
    _.merge(imagesOptions, imagesDefaults, options.images);

    gulp.task(imagesOptions.name, function () {
        return gulp.src(options.paths.src.images, {base: './'})
            .pipe(gulpIf(options.debug, debug({title: imagesOptions.name})))
            .pipe(imagemin())
            .pipe(rename(function (path) {  // Replace the source paths with destination ones
                path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement);
            }))
            .pipe(gulp.dest('./'));
    });
    
    gulp.task(imagesOptions.name + ':watch', function () {
        watch(options.paths.src.images, function() {
            gulp.start(imagesOptions.name);
        });
    });
};
