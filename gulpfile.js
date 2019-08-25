const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const notify = require( 'gulp-notify' );
const pug = require( 'gulp-pug' );
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require( 'browser-sync' ).create();

const paths = {
  "pathPug": 'src/**/*.pug',
  "pathSass": 'src/sass/*.scss',
  "dist": 'dist/',
  'distCss': 'dist/css',
  'distWatchHtml': 'dist/*.html'
}

gulp.task( 'taskPug', function buildHtml(){
    return gulp.src(paths.pathPug)
               .pipe(pug({
                            pretty: '\t',
                            compileDebug: false
                        }))
               .on('error', notify.onError(function notifyErroPug (error){
                  return 'Erro na compilação do pug: \n' + error;
               }))
               .pipe( gulp.dest(paths.dist) )
               .pipe( browserSync.stream() )
});

gulp.task( 'taskSass', function buildSass(){
    return gulp.src(paths.pathSass)
               .pipe(sourcemaps.init())
               .pipe(sass({
                            outputStyle: 'compressed',
                            sourceComments: 'map'
                         }).on('error', sass.logError))
               .pipe(autoprefixer( 'last 2 version', '> 1%', 'ie 10' ))
               .pipe(sourcemaps.write('./'))
               .pipe( gulp.dest( paths.distCss))
               .pipe( browserSync.stream({stream:true}) );

});

gulp.task( 'initServer', ['taskPug'], function startServe(){

    browserSync.init({
       server: './dist'
    });

    gulp.watch( paths.pathPug, ['taskPug']);
    gulp.watch( paths.pathSass, ['taskSass']);
    gulp.watch( paths.distWatchHtml )
        .on( 'change', browserSync.reload );

});
