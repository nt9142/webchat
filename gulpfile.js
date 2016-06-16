/* global gulp, require */
(function () {
	var gulp = require('gulp'),
			argv = require('yargs').argv,
			inject = require('gulp-inject'),
			rename = require('gulp-rename'),
			series = require('stream-series'),
			runSequence = require('run-sequence'),
			concat = require('gulp-concat'),
			uglify = require('gulp-uglify'),
			uglifycss = require('gulp-uglifycss'),
			less = require('gulp-less'),
			filter = require('gulp-filter'),
			pug = require('pug'),
			del = require('del'),
			through = require('through2'),
			flatten = require('gulp-flatten'),
			paths = {
				src: 'src/web/**/*',
				dest: 'dist/',
				templates: 'src/web/**/*.{pug,jade}',
				images: 'src/web/**/*.{jpg,jpeg,png,svg}',
				concatjs: 'lib/js/webchat.js',
				concatcss: 'lib/css/webchat.css'
			};


	if (argv.debug) {
		gulp.watch(paths.src, ['build-src']);
	}

	gulp.task('default', function () {
		runSequence('clean', 'build-src');
	});

	gulp.task('build-src', function () {
		var tasks = ['concatcss', 'templates', 'images'];

		if (!argv.debug) {
			tasks.unshift('concatjs');
		}

		runSequence.apply(this, tasks);
	});


	gulp.task('concatjs', function () {
		return gulp.src(paths.src)
				.pipe(filter('**/*.js'))
				.pipe(concat(paths.concatjs))
				.pipe(uglify({preserveComments: 'license', mangle: false}))
				.pipe(gulp.dest(paths.dest));
	});

	gulp.task('concatcss', function () {
		return gulp.src(paths.src)
				.pipe(filter('**/*.less'))
				.pipe(less())
				.pipe(concat(paths.concatcss))
				.pipe(uglifycss({preserveComments: 'license'}))
				.pipe(gulp.dest(paths.dest));
	});

	gulp.task('templates', function () {
		var sources = {
			src: gulp.src(['./src/web/**/*.js', './src/web/**/*.css'], {read: false}),
			dist: gulp.src(['**/*.js', '**/*.css'], {read: false, cwd: __dirname + '/dist'})
		};

		var templates = gulp.src(paths.templates)
				.pipe(through.obj(function (file, enc, cb) {
					var fn = pug.compile(file.contents, {
						filename: file.path,
						pretty: true
					});
					file.contents = new Buffer(fn());

					cb(null, file);
				}))

				.pipe(rename(function (path) {
					var prefix;

					path.extname = '.html';

					if (!/\/|\\/.test(path.dirname)) {
						return path;
					}

					prefix = path.dirname
							.replace(/\/|\\/g, '-')
							.replace(/\.(\/|\\)?/g, '');

					if (prefix.length) {
						prefix += '-';
					}

					path.dirname = 'templates';
					path.basename = prefix + path.basename;
					return path;
				}));

		if (argv.debug) {
			templates = templates.pipe(inject(series(sources.dist, sources.src)));
		} else {
			templates = templates.pipe(inject(sources.dist));
		}

		templates.pipe(gulp.dest(paths.dest));
	});


	gulp.task('images', function () {
		return gulp.src(paths.images)
				.pipe(flatten())
				.pipe(gulp.dest(paths.dest + 'images/'));
	});

	gulp.task('clean', function () {
		return del(paths.dest + '**/*');
	});

})();