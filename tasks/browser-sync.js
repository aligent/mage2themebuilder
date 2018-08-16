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
    var browserSyncOptions = {},
        paths = options.paths;

    // Set options
    _.merge(browserSyncOptions, browserSyncDefaults, options.browserSync);

    // Set/override the proxy option via command line argument
    process.argv.forEach(function (arg) {
        var match,
            re = /^\-\-proxy\=\"?([A-Za-z0-9\.]+)\"?/;

        match = re.exec(arg);

        if (match !== null) {
            browserSyncOptions.proxy = match[1];
            return true;
        } else {
            return false;
        }
    });

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

        watch(paths.browserSync, browserSync.reload);
    });
};
