/* jshint node: true */
'use strict';

var _ = require('lodash'),
    browserSync = require('browser-sync'),     // Automatically refresh the browser
    browserSyncDefaults;


// Set module defaults
browserSyncDefaults = {
    name: 'serve',
    open: false
};


module.exports = function(gulp, options) {
    // Set options
    var browserSyncOptions = _.merge(browserSyncDefaults, options.browserSync),
        paths = options.paths;

    // Serve local files using browserSync
    gulp.task(browserSyncOptions.name, function () {
        // Add host rewrite if using proxy to make sure assets are all served
        // from the same source
        if (typeof browserSyncOptions.proxy !== 'undefined') {
            if (typeof browserSyncOptions.rewriteRules === 'undefined') {
                browserSyncOptions.rewriteRules = [];
            }

            browserSyncOptions.rewriteRules.push({
                match: (function () {
                    // Convert the proxy domain to a regex
                    var host = browserSyncOptions.proxy.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    var protocol = '(http(s)?\:((\\\\)?\/){2})?';
                    return new RegExp(protocol + host, 'g');
                }()),
                fn: function (match) {
                    // Remove the proxy domain
                    return '';
                }
            });
        }

        browserSync.init(browserSyncOptions);

        gulp.watch(paths.browserSync).on('change', browserSync.reload);
    });
};
