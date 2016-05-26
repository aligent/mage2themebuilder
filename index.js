/* jshint node: true */
'use strict';

var _ = require('lodash');

var defaults,
    isDevelopment;


defaults = {
    paths: {
        dest: {
            regex: new RegExp('(.*)(^|\/)(source)($|\/)(.*)'),
            replacement: '$1$2web$4$5'
        },
        src: {
            js: './**/source/**/*.js',
            sass: './**/source/**/*.scss'
        }
    }
};

isDevelopment = process.argv.some(function (arg) {
    var re = /^\-\-(dev|development)$/;

    return re.test(arg);
});


module.exports = function (gulp, options) {
    options = _.merge(defaults, options);

    // Set the mode to development, if required
    if (isDevelopment) {
        options.mode = 'development';
    }

    require('./tasks/browser-sync')(gulp, options);
    require('./tasks/cache-flush')(gulp, options);
    require('./tasks/javascript')(gulp, options);
    require('./tasks/sass')(gulp, options);

    return {
        isDevelopment: isDevelopment
    };
};
