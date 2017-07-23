const gulp = require( 'gulp' );
const gulpUtil = require( 'gulp-util' );
const pug = require( 'gulp-pug' );
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require( 'browser-sync' ).create();

gulp.task( 'taskPug', function buildHtml(){
    return gulp.src([
					'src/*.pug',
					'src/includes/*.pug'
					])
               .pipe( pug({
                   pretty: true
               }) )
               .pipe( gulp.dest('dist/') )
            //    .on( 'error', gulpUtil.log )
               .pipe( browserSync.stream() )
});

gulp.task( 'taskSass', function buildSass(){
    return gulp.src('src/sass/**/*.scss')
               .pipe(sass({
                            style: 'expanded',
                            sourceComments: 'map',
                            errLogToConsole: true
                         }))
               .pipe(autoprefixer( 'last 2 version', '> 1%', 'ie 10' ))
               .pipe( gulp.dest( 'dist/css' ))
               .on('error', gulpUtil.log)
               .pipe( browserSync.stream() );

});

gulp.task( 'initServer', ['taskPug'], function startServe(){

    browserSync.init({
       server: './dist'
    });

    gulp.watch( 'src/*.pug', ['taskPug']);
    gulp.watch( 'src/**/*.scss', ['taskSass']);
    gulp.watch( 'dist/*.html' )
        .on( 'change', browserSync.reload );

});
