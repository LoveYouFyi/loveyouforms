var fs = require('fs')

/*------------------------------------------------------------------------------
  run file import from command-line: 
  $ node -e "require('./replace.js').replace('\'./dev/loveyouforms-package\'', '\'loveyouforms\'')"
  $ node -e "require('./replace.js').replace('\'loveyouforms\'', '\'./dev/loveyouforms-package\'')"
------------------------------------------------------------------------------*/

module.exports.replace = (edit, replace) => 
  fs.readFile("index.js", 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    console.log("edit/replace ", edit, replace);

    var regex = new RegExp(edit, 'g');

    var result = data.replace(regex, replace);

    fs.writeFile("index.js", result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
