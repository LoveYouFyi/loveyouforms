const fs = require('fs')

/*------------------------------------------------------------------------------
  run file import from command-line: 
  $ node -e "require('./replace.js').replace( 'require(\'loveyouforms\')' , 'require(\'./dev/loveyouforms-package\')'   )" 
  $ node -e "require('./replace.js').replace( 'require(\'./dev/loveyouforms-package\')' , 'require(\'loveyouforms\')'   )"
------------------------------------------------------------------------------*/

module.exports.replace = (edit, replace) => 
  fs.readFile("index.js", 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    
    // 'data' is string: use string.replace() instead of regex -> easier to replace full require statement
    const result = data.replace(edit, replace);

    fs.writeFile("index.js", result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
