/* jshint node: true, esnext: true */
'use strict';

const exec = require('child_process').exec;

var _ = require('lodash'),
    shellDefaults;

shellDefaults = {
    name: 'shell',
    run: {
        development: true,
        production: false
    },
    task: {
        //command: 'bin/magento cache:clean layout',
        //startMessage: 'Flushing layout cache...',
        //endMessage: 'Layout cache flushed'
    },
    vagrant: {
        name: '',
        path: '/vagrant/'
    },
    watchPath: false
};


module.exports = function (gulp, options) {
    // Set options
    var command = '',
        shellOptions = _.merge(shellDefaults, options.shell);

    // Set the default value for `run` based on the development mode

    // Build the shell command
    command += shellOptions.task.command;

    if ('vagrant' in shellOptions) {
        command =  shellOptions.vagrant.path + command;
        command = 'vagrant ssh ' + shellOptions.vagrant.name + ' --command "' + command.replace(/\"/g, '\\"') + '"';
    }

    gulp.task(shellOptions.name, function (done) {
        if (shellOptions.run.development && options.mode === 'development' || shellOptions.run.production && options.mode !== 'development') {
            if ('startMessage' in shellOptions.task) {
               console.log(shellOptions.task.startMessage);
            }

            exec(command, function (error, stdout, stderr) {
                if (error) {
                    done(error);
                    return;
                }

                console.log(stdout);
                console.log(stderr);

                if ('endMessage' in shellOptions.task) {
                    console.log(shellOptions.task.endMessage);
                }

                done();
            });
        } else {
            done();
        }
    });

    if (shellOptions.watchPath) {
        gulp.task(shellOptions.name + ':watch', function () {
            gulp.watch(shellOptions.watchPath, [shellOptions.name]);     // TODO consider changing to gulp-watch so new files are detected
        });
    }
};
