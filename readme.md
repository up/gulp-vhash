# gulp-vhash [![Build Status](https://travis-ci.org/up/gulp-vhash.svg?branch=master)](https://travis-ci.org/up/gulp-vhash)

> ### Asset versioning for browser caching optimization

**Static HTML File(s)**        
Appending or updating content hash value as parameter to src/href attributes in HTML or template files.

`<link rel="stylesheet" href="assets/stylesheets/common.css"/>` 
=> 
`<link rel="stylesheet" href="assets/stylesheets/common.css?v=185d182710c120e9051d20fa386a4212/>`

**JSON Hash File**         
Saves a json file named '**vhash.json**' in root directory with matched file names (as identifiers) and their md5 hash values. 

    {
      "common.css": "185d182710c120e9051d20fa386a42",
      "all.min.js": "e86bfc2fd4d6c2f86825791492d88283"
    }


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
