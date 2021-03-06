var assert = require('assert');
var path = require('path');
var gutil = require('gulp-util');
var vhash = require('../index');

var testfile = 'test/mocha/test.css';
var testhash = '185d182710c120e9051d20fa386a4212';

describe('gulp-vhash tests', function(){

  describe('createHashString()', function(){

    it('should return correct hash', function(){
      
      var stream = vhash();

      stream.on('data', function (file) {
        assert.equal(file.hash, testhash);
      });

      stream.write(new gutil.File({
        path: testfile,
        contents: new Buffer('')
      }));
    
    });
  
  });

  describe('addFileHash()', function(){
    it('should create correct json hash object', function(){
      
      var stream = vhash();

      stream.write(new gutil.File({
        path: testfile,
        contents: new Buffer('')
      }));
    
      stream.end(function () {
        vhash.addFileHash(testfile), 
        assert.equal(
          vhash.data['test.css'],
          testhash
        );
      });

    });
  
  });

  describe('replaceHash()', function(){
    
    it('should create hash parameter', function(){
      
      var stream = vhash();
    
      stream.end(function (file) {
        assert.equal(vhash.replaceHash(
          '<link rel="stylesheet" href="assets/stylesheets/common.css"/>', 
          testhash, 'common.css'
        ), '<link rel="stylesheet" href="assets/stylesheets/common.css?v=' + testhash + '"/>');
      });

    });
  
    it('should replace existing hash parameter', function(){
      
      var stream = vhash();
    
      stream.end(function (file) {
        assert.equal(vhash.replaceHash(
          '<link rel="stylesheet" href="assets/stylesheets/common.css?v=1234567890abcde"/>', 
          testhash, 'common.css'
        ), '<link rel="stylesheet" href="assets/stylesheets/common.css?v=' + testhash + '"/>');
      });

    });
  });

});