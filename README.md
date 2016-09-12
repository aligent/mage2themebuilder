# Magento 2 Theme Builder
A front end build system for use with Magento 2 projects

## Installation
N.B. The theme builder uses the `gulp-sass` plugin, which requires a recent version of NodeJS. Suggestion would be to update your NodeJS version to the latest available for your platform before running `npm install` with the following in your package.json

Add the following to your `package.json` file

`"aligent-theme-builder": "aligent/mage2themebuilder#develop"`

This will download the latest develop branch.

### Downloading Updates
If there are updates in the package, just running `npm install` probably won't download the latest `develop` branch. To fix this, you'll need to remove the `aligent-theme-builder` directory from the `node_modules` directory, and then run `npm install`.

Alternatively, you can clear out the whole `node_modules` folder, clear the cached, and install the packages by running the following command

`rm -rf node_modules && npm cache clean --force && npm install`

## Usage
The theme builder uses gulp as its build system, so to get started, ensure you have gulp installed. [See here for instructions](http://gulpjs.com/).

### Sample gulp file
```
'use strict';

const gulp = require('gulp');

var options = {
        browserSync: {
            proxy: 'local.website.com.au'
        },
        sass: {
            includePaths: [
                './app/design/frontend/[WebsiteName]/base/source/sass',  // [WebsiteName] base theme
                './node_modules'                                         // Dependencies
            ]
        },
        vagrant: {
            name: 'default'
        }
    },
    tasks,
    themeBuilder = require('aligent-theme-builder')(gulp, options);

// Set different tasks for production and development
if (themeBuilder.isDevelopment) {
    tasks = [
        'javascript',
        'sass',
        'serve',
        'cache:flush:watch',
        'javascript:watch',
        'sass:watch',
        'images'
    ];
} else {
    tasks = [
        'javascript',
        'sass',
        'images'
    ];
}

// Create the default task
gulp.task('default', tasks);
```

## Tasks
### Browsersync
Browsersync allows for live-reloading of a browser tab when source files are edited.

The following tasks are watched when gulp is run with the `--dev` flag enabled:

* javascript
* sass
* cache-flush

### Cache-flush
The cache-flush task will execute commands that will flush the layout, html and translation cache's.

This is mainly for use with browsersync.

### Images
Images are minified using `gulp-imagemin` before being copied to the destination directory

### Javascript
The themebuilder is set up to handle ES2015 javascript, using `gulp-babel` to transpile the source to browser compatible code.

The only other pipe in the javascript task is `gulp-uglify`, reducing the destination javascript file size - 

### SASS
Source `.scss` files are compiled to CSS using the `gulp-sass` plugin.

There is also an autoprefixer pipe in the build task using `gulp-autoprefixer`

The other two tasks are run dependant on being in production or development:

&nbsp;&nbsp;&nbsp;&nbsp;Minification using `gulp-clean-css` if in production mode

&nbsp;&nbsp;&nbsp;&nbsp;Source map generation using `gulp-sourcemaps` if in development mode


## Contributing
Contributions can be made to update the package by creating a pull request into the `develop` branch.

Ensure that when you clone the repo, you start your development from the `develop` branch, to avoid any merge conflicts in the pull request.
