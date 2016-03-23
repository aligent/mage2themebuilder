'use strict';

var merge = require('merge');

var defaults = {
    paths: {
        dest: {
            regex: new RegExp('(.*)((?:^|\/)web\/.*)(source(?:$|\/))(.*)'),
            replacement: '$1$2$4'
        },
        src: {
            js: './**/web/**/source/**/*.js',
            sass: './**/web/**/source/**/*.scss'
        }
    }
};



module.exports = function (gulp, options) {
    options = merge(defaults, options);

    require('./tasks/browser-sync')(gulp, options);
    require('./tasks/javascript')(gulp, options);
    require('./tasks/sass')(gulp, options);
};