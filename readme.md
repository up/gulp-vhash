# [gulp](https://github.com/wearefractal/gulp)-vhash [![Build Status](https://travis-ci.org/up/gulp-vhash.svg?branch=master)](https://travis-ci.org/up/gulp-vhash)

> Asset revisioning by appending content hash as parameter to filenames 
`common.css` => `common.css?v=185d182710c120e9051d20fa386a4212`

Make sure to set the files to [never expire](http://developer.yahoo.com/performance/rules.html#expires) for this to have an effect.


## Install

```
$ npm install --save-dev gulp-vhash
```


## Usage

```
var gulp = require('gulp');
var vhash = require('gulp-vhash');

gulp.task('default', function() {
  return gulp.src('src/**/*.*')
  .pipe(
    vhash({ 
      html: [
        'index.htm', 
        'test.htm'
      ],
      type: ['js', 'css'],
      exclude: ['/libs'],
      path: false,
      cleanup: true,
      json: 'filehashes.json',
      debug: true
    })
  )
  
});
```

An json file with file names and their md5 hash value, will be written to `options.json` (Default `vhash.json` in root directory):

```
{
  "common.css": "185d182710c120e9051d20fa386a4212"
}
```


## License

[MIT](http://opensource.org/licenses/MIT) © [Uli Preuss](http://ulipreuss.eu)
