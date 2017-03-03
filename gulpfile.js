const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const ava = require('gulp-ava');
const tslint = require('gulp-tslint');
const del = require('del');

const tsProject = ts.createProject('tsconfig.json');
const paths = {
  fixturesOut: './js/test/fixtures',
  fixturesIn: ['./ts/test/fixtures/**'],
  testsOut: ['./js/test/**', '!./js/test/fixtures/**'],
  unitTests: ['./js/test/unit/**'],
  scriptsOut: ['./js/lib/**'],
  source: ['./ts/**/*.ts'],
};

gulp.task('lint', () =>
  gulp.src(paths.source)
    .pipe(tslint({
      formatter: 'stylish',
    }))
    .pipe(tslint.report({
      emitError: false,
    })));

gulp.task('scripts', ['clean:tests', 'clean:scripts'], () => {
  const tsResult = gulp.src(paths.source)
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js.pipe(sourcemaps.write('.', { includeContent: false, destPath: './js' }))
    .pipe(gulp.dest('./js'));
});

gulp.task('clean:fixtures', () =>
  del(paths.fixturesOut));
gulp.task('clean:tests', () =>
  del(paths.testsOut));
gulp.task('clean:scripts', () =>
  del(paths.scriptsOut));
gulp.task('clean', ['clean:fixtures', 'clean:tests', 'clean:scripts']);

gulp.task('watch', ['lint', 'scripts'], () =>
  gulp.watch(paths.source, ['lint', 'scripts']));

gulp.task('test', ['lint', 'scripts'], () => {
  gulp.src(paths.fixturesIn)
    .pipe(gulp.dest('./js/test/fixtures'));
  return gulp.src(paths.testsOut)
    .pipe(ava({ verbose: true }));
});

// for working without Mongo on laptop
gulp.task('test:unit', ['lint', 'scripts'], () => {
  gulp.src(paths.fixturesIn)
    .pipe(gulp.dest('./js/test/fixtures'));
  return gulp.src(paths.unitTests)
    .pipe(ava({ verbose: true }));
});

gulp.task('test:watch', ['test'], () =>
  gulp.watch(paths.source, ['test']));

gulp.task('default', ['watch']);
