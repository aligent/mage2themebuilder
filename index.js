/* jshint node: true */
'use strict';

var _ = require('lodash');

var defaults,
    isDevelopment,
    noLocal;


defaults = {
    paths: {
        dest: {
            regex: new RegExp('(.*)(^|\/)(source)($|\/)(.*)'),
            replacement: '$1$2web$4$5'
        },
        src: {
            js: './app/design/frontend/**/source/**/*.js',
            sass: './app/design/frontend/**/source/**/*.scss',
            images: './app/design/frontend/**/source/images/*'
        }
    }
};

// Command line argument to set development mode
isDevelopment = process.argv.some(function (arg) {
    var re = /^\-\-(dev|development)$/;

    return re.test(arg);
});

// Command line argument to ignore local settings
noLocal = process.argv.some(function (arg) {
    var re = /^\-\-(nolocal)$/;

    return re.test(arg);
});

module.exports = function (gulp, options) {
    // Allow local user-defined options to be set in a separate file
    var userOptions = {};

    // Only load the local options if the development argument has been used, and the nolocal argument has not been used
    if (isDevelopment && !noLocal) {
        try {
            userOptions = require(process.cwd() + '/themebuilder.local.js');
        } catch (e) {
            // Fail silently if the module is not found, log all other errors
            if (e.code !== 'MODULE_NOT_FOUND') {
                console.log('Error loading themebuilder.local.js:');
                console.log(e.stack);
            }
        }
    }

    // Merge all available options
    options = _.merge(defaults, options, userOptions);

    // Set the mode to development, if required
    if (isDevelopment) {
        options.mode = 'development';
    }

    require('./tasks/browser-sync')(gulp, options);
    require('./tasks/cache-flush')(gulp, options);
    require('./tasks/javascript')(gulp, options);
    require('./tasks/sass')(gulp, options);
    require('./tasks/images')(gulp, options);

    return {
        isDevelopment: isDevelopment
    };
};
