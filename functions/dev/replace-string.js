const fs = require('fs')

/*------------------------------------------------------------------------------
  Reads 'file' and finds string 'edit', then changes 'edit' to string 'replace' 
  and then saves file. 

  Example Usage
  run from command-line
  $ node -e "require('./dev/replace-string.js').replace('index.js', 'require(\'loveyouforms\')' , 'require(\'./dev/loveyouforms-package\')' )" 
  $ node -e "require('./dev/replace-string.js').replace('index.js', 'require(\'./dev/loveyouforms-package\')' , 'require(\'loveyouforms\')' )"
------------------------------------------------------------------------------*/

module.exports.replace = (file, edit, replace) => 
  fs.readFile(file, 'utf8', function (err, data) {

    if (err) {
      return console.log(err);
    }
    
    // 'data' is string: use string.replace() instead of regex -> easier to replace full require statement
    const result = data.replace(edit, replace);

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
