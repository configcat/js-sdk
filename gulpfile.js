var gulp = require('gulp');
var replace = require('gulp-replace');
var fs = require('fs');

const OUT_DIST = 'dist';
const OUT_ESM = 'lib/esm';
const OUT_LEGACY = 'lib';

function updateVersion(dst, file) {

  const VERSION = JSON.parse(fs.readFileSync('./package.json')).version;

  return gulp.src(dst + '/' + file)
    .pipe(replace('CONFIGCAT_SDK_VERSION', VERSION))
    .pipe(gulp.dest(dst));
}

function updateVersion_dist() {
  return updateVersion(OUT_DIST, 'configcat.js');
}

function updateVersion_esm() {
  return updateVersion(OUT_ESM, 'Version.js');
}

function updateVersion_legacy() {
  return updateVersion(OUT_LEGACY, 'Version.js');
}

exports.tsc = gulp.series(
  gulp.parallel(updateVersion_esm, updateVersion_legacy));

exports.webpack = gulp.series(
  gulp.parallel(updateVersion_dist));
