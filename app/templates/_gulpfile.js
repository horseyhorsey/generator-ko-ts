// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'),
 chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'),
    concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'),
    tsc = typescript = require('gulp-tsc'),
    htmlreplace = require('gulp-html-replace'), typescript = require('gulp-typescript'),
    sass = require('gulp-sass'), imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(), runSequence = require('run-sequence');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
    out: 'scripts.js',
    baseUrl: './src',
    name: 'app/startup',
    paths: {
        requireLib: 'bower_modules/requirejs/require'
    },
    include: [
        'requireLib',
        'components/nav-bar/nav-bar',
        'components/home-page/home',
        'text!components/about-page/about.html'
    ],
    insertRequire: ['app/startup'],
    bundles: {
        // If you want parts of the site to load on demand, remove them from the 'include' list
        // above, and group them into bundles here.
        // 'bundle-name': [ 'some/module', 'another/module' ],
        // 'another-bundle-name': [ 'yet-another-module' ]
    }
});

//Gen Js from Typescript files
var ts = require("gulp-typescript");
gulp.task("tsc", function () {
    gulp.src("src/**/*.ts")
        .pipe(ts({
            "compilerOptions": {
                "target": "es5",
                "lib": ["es2015", "dom"],
                "module": "amd",
                "moduleResolution": "node",
                "sourceMap": true,
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
                "removeComments": false,
                "noImplicitAny": true
            },
            "exclude": [
                "node_modules"
            ],
            "compileOnSave": true
        }))
        .pipe(gulp.dest("wwwroot/js"));
});

//Builds styles.scss to styles.css
gulp.task('sass', function () {
    return gulp.src('./src/sass/styles.scss')
      .pipe(sass())
      .pipe(gulp.dest('./src/css'))
      .pipe(browserSync.reload({
        stream: true
    }));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(gulp.dest('./dist/'));
});

// Discovers all AMD dependencies,
// concatenates together all required .js files, minifies them
gulp.task('js_min', function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Concatenates CSS files, bootstrap, font awesome & site.
gulp.task('css', function () {
    var bowerCss = gulp.src('src/bower_modules/bootstrap/dist/css/bootstrap.min.css'),
        faCss = gulp.src('src/bower_modules/font-awesome/css/font-awesome.min.css'),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, faCss, appCss).pipe(concat('css.css'));
    return es.concat(combinedCss)
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({
    stream: true
    }));
    });

// Run image min on all images
gulp.task('image', function () {
    return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function () {

    return gulp.src(['src/bower_modules/font-awesome/fonts/*', 'src/bower_modules/bootstrap/dist/fonts/*'])
    .pipe(gulp.dest('dist/fonts'))
});

//Run sass and css task in a sequence.
gulp.task('styles', function (callback) {
    runSequence('sass', 'css', callback);
});

//Reload a knockout component, don't minify to save time
//Build js for ko to see change
gulp.task('ko_comp_reload', function (callback) {
    runSequence('html', 'js', callback);
});

//Serve src with browser sync
gulp.task('src', ['sass'], function (callback) {

    browserSync.init({
        server: "./src"
    });

    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/**/*.html', ['html']);

    callback();
});

//Serve dist with browser sync
gulp.task('dist', ['html', 'js', 'sass','fonts', 'css'], function (callback) {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/**/*.html', ['ko_comp_reload']);

    callback();
});

// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task('clean', function () {
    var distContents = gulp.src('dist/**/*', { read: false }),
        generatedJs = gulp.src(['src/**/*.js', 'src/**/*.js.map'], { read: false })
            .pipe(es.mapSync(function (data) {
                // Include only the .js/.js.map files that correspond to a .ts file
                return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
            }));
    return es.merge(distContents, generatedJs).pipe(clean());
});

gulp.task('default', ['html', 'js_min', 'sass', 'fonts', 'css'], function (callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

