require('harmonize')();

var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
//var htmltidy = require('gulp-htmltidy');
var htmlclean = require('gulp-htmlclean');

var paths = {
    scripts: [
        "glMatrix-0.9.5.min.js",
        "util.js",
        "proc.js",
        "texture.js",
        "init.js",
        "shaders.js",
        "sfx.js",
        "keyboard.js",
        "Mesh.js",
        "Actor.js",
        "Drone.js",
        "Laser.js",
        "Pod.js",
        "Grid.js",
        "level.js",
        "scene.js",
        ],
    html: ['index.html'],
    dist: 'dist/'
};

var compilerOptions={
    compilerPath: 'tools/compiler.jar',
    fileName: 'full.js',
    compilerFlags: {
        //closure_entry_point: 'proc.start',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        // define: [
        //     "goog.DEBUG=false"
        // ],
        // externs: [
        //     'bower_components/este-library/externs/react.js'
        // ],
        extra_annotation_name: 'jsx',
        //only_closure_dependencies: true,
        // .call is super important, otherwise Closure Library will not work in strict mode.
        //output_wrapper: '(function(){%output%}).call(window);',
        //warning_level: 'VERBOSE',
        warning_level: 'QUIET'
    }
};

gulp.task('default', function(){
    gulp.src(paths.scripts)
        //.pipe(concat("all.js"))
        .pipe(closureCompiler(compilerOptions))
        .pipe(gulp.dest(paths.dist));

    gulp.src(paths.html)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist))
});
