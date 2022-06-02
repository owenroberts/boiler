const { src, dest, watch, series, parallel, task } = require('gulp');

const doodoo = process.env.USE_DOODOO ? require('./doodoo/gulpfile') : null;
const lines = process.env.USE_DOODOO ? require('./lines/gulpfile') : null;

const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const npmDist = require('gulp-npm-dist');

function browserSyncTask() {
	return browserSync.init({
		port: 8080,
		server: {
			baseDir: './',
		}
	});
}

function jsTask() {
	return src('./src/**/*')
		.pipe(sourcemaps.init())
		.pipe(concat('gme.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./src_maps'))
		.pipe(dest('./build'))
		.on('error', function handleError() {
			this.emit('end'); // Recover from errors
		})
		.pipe(browserSync.stream());
}

function libTask() {
	return src(npmDist(), { base: './node_modules' })
		.pipe(dest('./build/lib'));
}


function doodooCopy() {
	if (!doodoo) return;
	return src('./doodoo/build/**/*')
		.pipe(dest('./build'))
		.pipe(browserSync.stream());
}

function linesCopy() {
	if (!lines) return;
	return src([
			'./lines/build/base.min.js', 
			'./lines/build/src_maps/base.min.js.map',
			'./lines/build/game.min.js',
			'./lines/build/src_maps/game.min.js.map',
			'./lines/build/lib/**/*',
		], { base: './lines/build/' })
		.pipe(dest('./build'))
		.pipe(browserSync.stream());
}

function watchTask(){
	watch('src/**/*.js', series(jsTask));
	if (doodoo) {
		watch(['./doodoo/src/*.js'], series(doodoo.exportTask, doodooCopy));
	}
	if (lines) {
		watch(['./lines/classes/*.js', './lines/game/classes/*.js'], series(lines.exportTask, linesCopy));
	}
}

function cacheBustTask(){
	var cbString = new Date().getTime();
	return src(['index.html'])
		.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
		.pipe(dest('.'));
}


task('js', jsTask);
task('watch', parallel(cacheBustTask, browserSyncTask, watchTask));
task('default', parallel('watch'));

const libTasks = [libTask];
if (doodoo) {
	libTask.push(doodoo.exportTask);
	libTask.push(doodooCopy);
}
if (lines) {
	libTask.push(lines.exportTask);
	libTask.push(linesCopy);
}

console.log(...libTasks)
task('lib', series(...libTasks));
task('build', series(...[...libTasks, jsTask]));