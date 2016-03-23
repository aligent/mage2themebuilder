'use strict';

var merge = require('merge');

var defaults = {
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



module.exports = function (gulp, options) {
    options = merge(defaults, options);

    require('./tasks/browser-sync')(gulp, options);
    require('./tasks/javascript')(gulp, options);
    require('./tasks/sass')(gulp, options);
};