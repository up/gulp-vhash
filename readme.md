# gulp-vhash [![Build Status](https://travis-ci.org/up/gulp-vhash.svg?branch=master)](https://travis-ci.org/up/gulp-vhash)

### Asset versioning (for browser caching optimization)

#### 1. Static HTML File(s)       
Creating or updating content hash value **as parameter** to src/href attributes in HTML or template files without manual preparations (like html comments).

**Stylesheet**

    <link rel="stylesheet" href="common.css"/>

_Result_:

    <link rel="stylesheet" href="common.css?v=185d182710c120e9051d20fa386a4212/>

**JavaScript**
   
    <script src="all.min.js"></script>

_Result_:

    <script src="all.min.js?v=e86bfc2fd4d6c2f86825791492d88283"></script>

#### 2. JSON Hash File        
Saves a file named '**vhash.json**' in root directory with matched file names (as identifiers) and their md5 hash values. 

    {
      "common.css": "185d182710c120e9051d20fa386a42",
      "all.min.js": "e86bfc2fd4d6c2f86825791492d88283"
    }


**Note**        
> Please read '[Add an Expires or a Cache-Control Header](http://developer.yahoo.com/performance/rules.html#expires)!'


## Install

```
$ npm install gulp-vhash
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
    'html/**/*.{htm*,tmpl}'
   ));
  
});
```

## License

[MIT](http://opensource.org/licenses/MIT) © [Uli Preuss](http://ulipreuss.eu)
