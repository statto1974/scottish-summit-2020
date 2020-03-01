'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// add the pnp serve info tasks to get query string
require('./gulpfile-serve-info');

build.initialize(gulp);
