"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var tsProject = ts.createProject("tsconfig.json");
var mocha = require('gulp-mocha');

// clean
gulp.task("clean", function() {
 return del(['lib/**/*']);
});

// build
gulp.task("tsc", function () {
 return tsProject.src()
 .pipe(tsProject())
 .js.pipe(gulp.dest("lib"));
});

// test
gulp.task("test", ["clean", "tsc", "test-only"], function () {	
});

// test-only
gulp.task("test-only", function () {
	gulp.src(["tests/**/*.ts"], {read: false})
		.pipe(mocha({reporter: "list", exit: true, require: "ts-node/register", timeout: 30000}))
		.on('error', console.error)
});

// adding default tasks as clean and build
gulp.task("default", ["clean","tsc"], function () {
});