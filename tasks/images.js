/* jshint node: true */
'use strict';

var _ = require('lodash'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename');

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
            .pipe(imagemin())
            .pipe(rename(function (path) {  // Replace the source paths with destination ones
                path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement);
            }))
            .pipe(gulp.dest('./'));
    });
};
