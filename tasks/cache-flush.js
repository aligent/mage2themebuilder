/* jshint node: true, esnext: true */
'use strict';

var _ = require('lodash'),
    cacheFlushDefaults;

cacheFlushDefaults = {
    name: 'cache:flush',
    reload: true,
    run: {
        development: true,
        production: false
    },
    tasks: [
        {
            command: 'bin/magento cache:flush layout full_page',
            name: 'cache:flush:layout',
            startMessage: 'Flushing layout cache...',
            endMessage: 'Layout cache flushed',
            watchPath:'./app/**/layout/**/*.xml'
        },
        {
            command: 'bin/magento cache:flush block_html full_page',
            name: 'cache:flush:html',
            startMessage: 'Flushing block HTML cache...',
            endMessage: 'Block HTML cache flushed',
            watchPath: './app/**/templates/**/*.phtml'
        },
        {
            command: 'bin/magento cache:flush translate full_page',
            name: 'cache:flush:translate',
            startMessage: 'Flushing translation cache...',
            endMessage: 'Translation cache flushed',
            watchPath: './app/**/i18n/**/*.csv'
        }
    ]
};


module.exports = function (gulp, options) {
    var cacheFlushOptions = {},
        tasks = [],
        watchTasks = [];

    // Set options
    _.merge(cacheFlushOptions, cacheFlushDefaults, options.cacheFlush);

    cacheFlushOptions.tasks.forEach(function (taskOptions) {
        // Create a copy of the options object
        var shellOptions = Object.create(options);

        // Add build options for each individual shell task
        shellOptions.shell = {
            name: taskOptions.name,
            reload: cacheFlushOptions.reload,
            run: cacheFlushOptions.run,
            task: taskOptions,
            watchPath: taskOptions.watchPath
        };

        if ('vagrant' in cacheFlushOptions) {
            shellOptions.shell.vagrant = cacheFlushOptions.vagrant;
        }

        // Create the task
        require('./shell')(gulp, shellOptions);

        // Add each task to the list of dependent tasks
        tasks.push(shellOptions.shell.name);

        if (shellOptions.shell.watchPath) {
            watchTasks.push(shellOptions.shell.name + ':watch');
        }
    });

    gulp.task(cacheFlushOptions.name, tasks);
    gulp.task(cacheFlushOptions.name + ':watch', watchTasks);
};
