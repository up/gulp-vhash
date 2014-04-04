/* jshint node:true, esnext:true */

var fs = require('fs');
var path = require('path');
var hash = require('crypto');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-vhash';

var debug = false;
var data = {};

function log(msg){
  if(debug) {
    gutil.log('[DEBUG] >> ' + msg);
  }
}

function createHashString(file) {
  return hash.createHash('md5').update(fs.readFileSync(file)).digest("hex");
}

function writeFile(file, content, callback) {
  fs.writeFile(file, content, function(err) {
    if (err) {
      throw err;
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
      throw err;
    }
    if (callback) {
      callback(data);
    }
  });
}

function mergeObjectsRecursive(obj1, obj2) {
  for (var p in obj2) {
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
  return obj1;
}

function addFileData(src, options) {
    
  options.type.forEach(function(type) {
    var workingDir = path.dirname(fs.realpathSync(__filename)).split('/').pop();
    var identifier = src.split(workingDir)[1];
    var isType = path.extname(src) === '.' + type;
    var isExcude = !! ~src.indexOf(options.exclude);
    if (isType && !isExcude) {
      if(!options.path) {
        identifier = path.basename(src);
      }
      data[identifier] = createHashString(src);
    }
  });
}

function replaceHash(markup, hash, file) {
  var re = new RegExp(file + "?(\\?v=[a-z0-9]+|)", "i");
  return markup.replace(re, file + '?v=' + hash);
}

function generateResults(options){
  return readFile(options.json, function(json) {
    var obj, content;
    json = options.cleanup ? "{}" : json;
    obj = mergeObjectsRecursive(JSON.parse(json), data),
		json_string = JSON.stringify(obj, null, "   ");
    
		log('JSON file content: ' + json_string);
		
    writeFile(
      options.json,
      json_string, 
      function() {
        var htmlfiles = options.html || [];
    
        if(typeof htmlfiles === 'string') {
          htmlfiles = [htmlfiles];
        }
      
        htmlfiles.forEach(function(htmlfile){
      
          if(htmlfile !== '') {
            readFile(htmlfile, function(markup) {
              var file, hash;
              for (file in obj) {
                hash = obj[file];
                markup = replaceHash(markup, hash, file);
              }
              writeFile(htmlfile, markup);
            });
          }
          
        });
      
      }
    );
    return json;
  });
  
}

function vhash(options) {
  
  options = options || {};
  
  var type = options.type || ['css'];
  if(typeof options.type === 'string') {
    type = [options.type];
  }
  
  options = {
    type : type,
    exclude : options.exclude || ['/xyz012321zyx'],
    path : options.path || false,
    cleanup : options.cleanup || false,
    html: options.html || [],
    json: options.json || 'vhash.json',
    debug : options.debug || false
  };  
  
  if(options.debug) {
    debug = true;
  }
      
  /* Creating a stream through which each file will pass ******************************/
  var stream = through.obj(function(file, enc, callback) {
    
    // Do nothing if no contents
    if (file.isNull()) {
      this.push(file); 
      return callback();
    }

    // Process source files (js, css)
    if (file.isBuffer()) {
      
      // save the old path for tests
      file.orig = {
        path: file.path,
        base: file.base
      }
      file.hash = createHashString(file.path);

      addFileData(file.path, options);
      
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    }
  })
  
  /* Callback *************************************************************************/
  .on('end', function () {
    
    fs.exists(options.json, function(exists) {
      if (!exists) {
        writeFile(options.json, '{}', function(){
          generateResults(options);
        });
      } else {
        generateResults(options);
      }
    });
       
  });
  
  return stream; 
  
}
vhash.replaceHash = replaceHash;
vhash.addFileData = addFileData;
vhash.data = data;

module.exports = vhash;