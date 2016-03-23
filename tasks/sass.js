'use strict';

var args = require('yargs').argv,   // Pass agruments using the command line
    autoprefixer = require('gulp-autoprefixer'),    // Add vendor prefixes to CSS
    autoprefixerDefaults,
    browserSync = require('browser-sync'),
    cleanCss = require('gulp-clean-css'), // Minify and optimise CSS
    cleanCssDefaults,
    merge = require('merge'),
    passthrough = require('gulp-empty'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),    // Compile CSS from .scss
    sassDefaults,
    sourcemaps = require('gulp-sourcemaps');


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
    includePaths: ['./node_modules']
};


// Production / development specific changes
if (args.dev || args.develop) {
    // Don't minify code in development
    cleanCss = passthrough;
} else {
    // Don't create sourcemaps in production
    sourcemaps = {
        init: passthrough,
        write: passthrough
    };
}


module.exports = function (gulp, options) {
    // Set options
    var autoprefixerOptions = merge(autoprefixerDefaults, options.autoprefixer),
        cleanCssOptions = merge(cleanCssDefaults, options.cleanCss),
        paths = options.paths,
        sassOptions = merge(sassDefaults, options.sass);

    // Compile CSS from Sass/sass
    gulp.task('sass', function () {
        return gulp.src(options.paths.src.sass)
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(cleanCss(cleanCssOptions))  // Minify if in production mode
            .pipe(rename(function (path) {  // Replace the source paths with destination ones
                path.dirname = path.dirname.replace(paths.dest.regex, paths.dest.replacement);
                path.dirname = path.dirname.replace(/(\/|^)(sass|scss)(\/|$)/gi, '$1css$3');
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./'))
            .pipe(browserSync.stream());
    });

    gulp.task('sass:watch', function () {
        gulp.watch(paths.src.sass, ['sass']);     // TODO consider changing to gulp-watch so new files are detected
    });
};