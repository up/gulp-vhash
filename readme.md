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

## Options

### type
Creating hashes for special file types
    
    // Value: String or Array
    // Default: 'css'
    type: ['js', 'css']

### exclude
Exclude folders in 'src' files

    // Value: String or Array
    // Default: ''
    exclude: ['/libs']
    
### html
Define static HTML or template file(s)

    // Value: String or Array
    // Default: ''
    html: [
      'index.htm', 
      'test.htm'
    ]

### json
Define path/name of json file

    // Value: String
    // Default: 'vhash.json'
    json: 'build/filehashes.json'

### path
Define relative path matching

    // Value: Boolean
    // Default: false
    path: true
    
### cleanup
Remove existing json file items

    // Value: Boolean
    // Default: false
    cleanup: true

### debug
Enable some debugging messages

    // Value: Boolean
    // Default: 'vhash.json'
    debug: true


## License

[MIT](http://opensource.org/licenses/MIT) © [Uli Preuss](http://ulipreuss.eu)
