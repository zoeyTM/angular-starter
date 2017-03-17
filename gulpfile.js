const gulp    = require('gulp'),
      sort    = require('sort-stream'),
      del     = require('del'),
      bs      = require('browser-sync').create(),
      $ = require('gulp-load-plugins')({
	      pattern:       ['gulp-*', 'gulp.*', 'main-bower-files'],
	      replaceString: /\bgulp[\-.]/
      });

const paths = {
	sass:       [
		'./src/sass/*.sass',
		'./src/sass/*.scss'
	],
	javascript: [
		'./src/client/**/*.js',
		'./src/client/**/*.module.js',
		'!./src/client/lib/**/*.js'
	],
	css:        [
		'./src/client/**/*.css',
		'!./src/client/**/*.min.css',
		'!./src/client/lib/**/*.css'
	]
};


gulp.task('default', ['inject'], () => {
	return $.notify({ message: 'Gulp is running!' });
});

gulp.task('styles', () => {
	return gulp.src(paths.sass)
			.pipe($.sass()
			             .on('error', $.sass.logError))
			.pipe($.autoprefixer('last 2 versions'))
			.pipe(gulp.dest('./src/client/assets/css'))
			.pipe($.rename({suffix: '.min'}))
			.pipe($.sourcemaps.init())
			.pipe($.cssnano())
			.pipe($.sourcemaps.write('.'))
			.pipe(gulp.dest('./src/client/assets/css'))
			.pipe($.notify({ message: 'Styles task complete' }))
			.pipe(bs.stream());
});

gulp.task('inject-bower', () => {
	let bowerStream = gulp.src(['./src/client/lib/**/*.js', './src/client/lib/**/*.css'])
	                      .pipe($.filter(['**/*.min.js', '**/*.css', '!**/angular-csp.css']))
	                      .pipe(sort((a, b) => {
		                      if (/angular\.min\.js/.test(a) || /angular\.min\.js/.test(b)) { return -1 }
		                      if (/angular-ui-router\.min\.js/.test(a) || /angular-ui-router\.min\.js/.test(b)) { return 1 }
		                      return 0
	                      }));

	return gulp.src('./src/client/index.html')
			.pipe($.inject(bowerStream, { ignorePath: 'src/client/', addRootSlash: false, name: 'bower' }))
			.pipe(gulp.dest('./src/client'))
			.pipe($.notify({ message: 'Package injection complete ;)' }));
});

gulp.task('inject', ['styles'], () => {
	let ngStream = gulp.src(paths.javascript)
	                   .pipe($.angularFilesort())
	                   .pipe($.angularFilesort());  // angularFilesort sorts in reverse order by default so we run it twice

	return gulp.src('./src/client/index.html')
	           .pipe($.inject(ngStream, { ignorePath: 'src/client/', addRootSlash: false }))
	           .pipe($.inject(gulp.src(paths.css, { read: false }), {
		           ignorePath:   'src/client/',
		           addRootSlash: false
	           }))
	           .pipe(gulp.dest('./src/client'))
	           .pipe($.notify({ message: 'Index.html injection complete' }));
});

gulp.task('browser-sync', ['nodemon'], () => {
	bs.init(null, {
		proxy: 'http://localhost:8000',
		port:  4000
	});
});

gulp.task('nodemon', (cb) => {
	let started = false;

	return $.nodemon({
		              script: './src/server/index.js',
		              ext:    'js sass scss',
		              watch:  './src',
		              tasks:  ['default']
	              })
	              .on('start', () => {
		              if (!started) {
			              cb();
			              started = true;
		              }
	              });
});

gulp.task('start', ['browser-sync'], () => {
	gulp.watch('./src/client/**/*.html')
			.on('change', bs.reload);
});

gulp.task('renew', (cb) => {
	del(['./.git', './README.md'])
			.then(() => {
				$.notify({ message: 'Directory renewed' });
				cb();
			});
});