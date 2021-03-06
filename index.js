/* jshint node:true, esnext:true */

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var hash = require('crypto');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-vhash';

var logging = false;
var jsonFile = 'vhash.json';
var data = {};

function log(msg){
  if(logging) {
    gutil.log('[VHASH LOG] >> ' + msg);
  }
}

function createHashString(file) {
  return hash.createHash('md5').update(fs.readFileSync(file)).digest("hex");
}

function writeFile(file, content, callback) {
  fs.writeFile(file, content, function(err) {
    if (err) {
      throw new PluginError(PLUGIN_NAME, err);
    } else {
      
      log("'" + file + "' was saved ..");
      
      if (callback) {
        callback();
      }
    }
  });
}

function readFile(file, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw new PluginError(PLUGIN_NAME, err);
    }
    if (callback) {
      callback(data);
    }
  });
}

function mergeObjectsRecursive(obj1, obj2) {
  for (var p in obj2) {
    if(obj2.hasOwnProperty(p)) {
      try {
        if (obj2[p].constructor == Object) {
          obj1[p] = mergeObjectsRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        obj1[p] = obj2[p];
      }
    }
  }
  return obj1;
}

function addFileHash(src) {
  var identifier = path.basename(src);
  data[identifier] = createHashString(src);
}

function replaceHash(markup, hash, file) {
  var re = new RegExp(file + "?(\\?v=[a-z0-9]+|)", "i");
  return markup.replace(re, file + '?v=' + hash);
}

function generateResults(htmlFiles){
  return readFile(jsonFile, function(json) {
    var json_string, obj;
    obj = mergeObjectsRecursive(JSON.parse(json), data);
    json_string = JSON.stringify(obj, null, "   ");
    
    log('JSON file content: ' + json_string);
    
    writeFile(jsonFile, json_string, function() {
          
        glob(htmlFiles, function (err, files) {
          
          if(err) {
            throw new PluginError(PLUGIN_NAME, err);
          }

          files.forEach(function(htmlfile){
      
            readFile(htmlfile, function(markup) {
              var file, hash;
              for (file in obj) {
                if(obj.hasOwnProperty(file)) {
                  hash = obj[file];
                  markup = replaceHash(markup, hash, file);
                }
              }
              writeFile(htmlfile, markup);
            });
          
          });

        });
            
      }
    );
    return json;
  });
  
}

function vhash(htmlFiles, enableLogging) {
  
  htmlFiles = htmlFiles || [];
  logging = enableLogging || logging;
  
  // Create file stream
  var stream = through.obj(function(file, enc, callback) {
    
    // Do nothing if no content
    if (file.isNull()) {
      this.push(file); 
      return callback();
    }

    // Process source files (js, css)
    if (file.isBuffer()) {
      
      file.hash = createHashString(file.path);

      addFileHash(file.path, htmlFiles);
      
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    }
  })
  
  /* Callback */
  .on('end', function () {
    
    fs.exists(jsonFile, function(exists) {
      if (!exists) {
        writeFile(jsonFile, '{}', function(){
          generateResults(htmlFiles);
        });
      } else {
        generateResults(htmlFiles);
      }
    });
       
  });
  
  return stream; 
  
}

// for mocha tests
vhash.replaceHash = replaceHash;
vhash.addFileHash = addFileHash;
vhash.data = data;

module.exports = vhash;