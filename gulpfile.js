var gulp = require('gulp');
var tsc = require('gulp-typescript');
var merge = require('merge-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

var paths = {
  typescript: './src/ts/**/*.ts',
  javascript: './src/js/**/*.js',
  css: './src/css/**/*.css',
  nodemodules: [
      './node_modules/three/build/three.min.js',
  ]
};

// Compile own TypeScript
gulp.task('typescript', function(done) {
    var tsProject = tsc.createProject('tsconfig.json');
    var tsResult = gulp.src([paths.typescript])
      .pipe(tsProject());
    return merge(tsResult, tsResult.js)
      .pipe(gulp.dest('./src/js'));
});

// Copy external dependencies
gulp.task('copy-dependencies', function(done) {
    gulp.src('./node_modules/object-hash/dist/object_hash.js').pipe(gulp.dest('./src/js'));
    done();
});

// Copy three.js to examples folder where it is imported externally
gulp.task('copy-node-modules', function(done) {
    gulp.src(paths.nodemodules).pipe(gulp.dest('./examples/js'));
    done();
});

// Run webpack
gulp.task('webpack', function(done) {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }
            resolve();
        });
    });
});

// Build task
gulp.task('build', gulp.series("copy-dependencies",  "typescript", "copy-node-modules", "webpack"));

// Development task
gulp.task('develop', function(done) {
  gulp.watch([paths.typescript], gulp.series("typescript", "webpack"));
  done();
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series("build", "develop"));
