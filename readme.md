# gulp-vhash [![Build Status](https://travis-ci.org/up/gulp-vhash.svg?branch=master)](https://travis-ci.org/up/gulp-vhash)

### Asset versioning for browser caching optimization

**Static HTML or Template Files Replacer/Updater**        
> Appending content hash as parameter to file names in HTML or template files.
>     
`common.css` => `common.css?v=185d182710c120e9051d20fa386a4212`

**JSON Hash File Generator** 

> Generate a json file with matched file names (as identifiers) and their md5 hash values. 
>        
`{"common.css": "185d182710c120e9051d20fa386a42}`

**Note**        
> Please read '[Add an Expires or a Cache-Control Header](http://developer.yahoo.com/performance/rules.html#expires)!'


## Install

```
$ npm install --save-dev gulp-vhash
```


## Usage

```
var gulp = require('gulp');
var vhash = require('gulp-vhash');

gulp.task('default', function() {
  
  return gulp.src(
    'src/**/*.{js,css}'
  )
  .pipe(vhash(
    'html/**/*.htm'
   ));
  
});
```

## License

[MIT](http://opensource.org/licenses/MIT) © [Uli Preuss](http://ulipreuss.eu)
