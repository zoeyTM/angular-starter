const gulp    = require('gulp'),
      sort    = require('sort-stream'),
      bs      = require('browser-sync').create(),
      plugins = require('gulp-load-plugins')({
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
	return plugins.notify({ message: 'Gulp is running!' });
});

gulp.task('styles', () => {
	return gulp.src(paths.sass)
			.pipe(plugins.sass()
			             .on('error', plugins.sass.logError))
			.pipe(plugins.autoprefixer('last 2 versions'))
			.pipe(gulp.dest('./src/client/assets/css'))
			.pipe(plugins.rename({suffix: '.min'}))
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.cssnano())
			.pipe(plugins.sourcemaps.write('.'))
			.pipe(gulp.dest('./src/client/assets/css'))
			.pipe(plugins.notify({ message: 'Styles task complete' }))
			.pipe(bs.stream());
});

gulp.task('inject-bower', () => {
	let bowerStream = gulp.src(['./src/client/lib/**/*.js', './src/client/lib/**/*.css'])
	                      .pipe(plugins.filter(['**/*.min.js', '**/*.css', '!**/angular-csp.css']))
	                      .pipe(sort((a, b) => {
		                      if (/angular\.min\.js/.test(a) || /angular\.min\.js/.test(b)) { return -1 }
		                      if (/angular-ui-router\.min\.js/.test(a) || /angular-ui-router\.min\.js/.test(b)) { return 1 }
		                      return 0
	                      }));

	return gulp.src('./src/client/index.html')
			.pipe(plugins.inject(bowerStream, { ignorePath: 'src/client/', addRootSlash: false, name: 'bower' }))
			.pipe(gulp.dest('./src/client'))
			.pipe(plugins.notify({ message: 'Package injection complete ;)' }));
});

gulp.task('inject', ['styles'], () => {
	let ngStream = gulp.src(paths.javascript)
	                   .pipe(plugins.angularFilesort())
	                   .pipe(plugins.angularFilesort());  // angularFilesort sorts in reverse order by default so we run it twice

	return gulp.src('./src/client/index.html')
	           .pipe(plugins.inject(ngStream, { ignorePath: 'src/client/', addRootSlash: false }))
	           .pipe(plugins.inject(gulp.src(paths.css, { read: false }), {
		           ignorePath:   'src/client/',
		           addRootSlash: false
	           }))
	           .pipe(gulp.dest('./src/client'))
	           .pipe(plugins.notify({ message: 'Index.html injection complete' }));
});

gulp.task('browser-sync', ['nodemon'], () => {
	bs.init(null, {
		proxy: 'http://localhost:8000',
		port:  4000
	});
});

gulp.task('nodemon', (cb) => {
	let started = false;

	return plugins.nodemon({
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