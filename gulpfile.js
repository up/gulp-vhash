var gulp = require('gulp');
var vhash = require('./index.js');

gulp.task('vhash', function() {
  
  var base = 'test/gulptest/';

  return gulp.src(base + 'src/**/*.*')
  .pipe(
    vhash({ 
      html: [
        base + 'html/index.htm', 
        base + 'html/test.htm'
      ],
      type: ['js', 'css'],
      exclude: ['/libs'],
      path: false,
      cleanup: true,
      json: base + 'filehashes.json',
      debug: true
    })
  )
  
});
  
gulp.task('default', [ 'vhash' ]);

  