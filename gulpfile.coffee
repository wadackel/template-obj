gulp = require("gulp")
$ = do require("gulp-load-plugins")


gulp.task("js", ->
  gulp.src("./template-obj.js")
  .pipe($.plumber())
  .pipe($.jshint())
  .pipe($.jshint.reporter("jshint-stylish"))
  .pipe($.rename(extname: ".min.js"))
  .pipe($.uglify(preserveComments: "some"))
  .pipe(gulp.dest("./"))
)


gulp.task("test", ->
  gulp.src("./test/index.html")
  .pipe($.qunit())
)


gulp.task("watch", ->
  gulp.watch("./template-obj.js", ["js"])
  gulp.watch("./test/tests.js", ["test"])
)


gulp.task("default", ["watch"])
gulp.task("build", ["js", "test"])
