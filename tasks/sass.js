/* jshint node: true */
'use strict';

var _ = require('lodash'),
    autoprefixer = require('gulp-autoprefixer'),    // Add vendor prefixes to CSS
    autoprefixerDefaults,
    browserSync = require('browser-sync'),
    cleanCss = require('gulp-clean-css'), // Minify and optimise CSS
    cleanCssDefaults,
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),    // Compile CSS from .scss
    sassDefaults,
    sourcemaps = require('gulp-sourcemaps'),
    debug = require('gulp-debug'),
    gulpIf = require('gulp-if');


// Set defaults
autoprefixerDefaults = {
        browsers: [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]
    };

cleanCssDefaults =  { };

sassDefaults = {
    includePaths: ['./node_modules'],
    name: 'sass'
};


module.exports = function (gulp, options) {
    var autoprefixerOptions = {},
        cleanCssOptions = {},
        paths = options.paths,
        sassOptions = {};

    // Set options
    _.merge(autoprefixerOptions, autoprefixerDefaults, options.autoprefixer);
    _.merge(cleanCssOptions, cleanCssDefaults, options.cleanCss);
    _.merge(sassOptions, sassDefaults, options.sass);

    // Compile CSS from Sass/sass
    gulp.task(sassOptions.name, function () {
        return gulp.src(options.paths.src.sass, {base: './'})
            .pipe(gulpIf(options.debug, debug({title: sassOptions.name})))
            .pipe(gulpIf(options.mode === 'development', sourcemaps.init())) // Don't create sourcemaps in production
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(gulpIf(options.mode !== 'development', cleanCss(cleanCssOptions)))  // Minify if in production mode
            .pipe(rename(function (path) {  // Replace the source paths with destination ones
                path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement);
                path.dirname = path.dirname.replace(/(\/|^)(sass|scss)(\/|$)/gi, '$1css$3');
            }))
            .pipe(gulpIf(options.mode === 'development', sourcemaps.write())) // Don't create sourcemaps in production
            .pipe(gulp.dest('./'))
            .pipe(browserSync.stream({match: '**/*.css'}));
    });

    gulp.task(sassOptions.name + ':watch', function () {
        gulp.watch(paths.src.sass, [sassOptions.name]);     // TODO consider changing to gulp-watch so new files are detected
    });
};
