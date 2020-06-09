var fs = require('fs')

/*------------------------------------------------------------------------------
  run file import from command-line: 
  $ node -e 'require("./replace.js").replace'
------------------------------------------------------------------------------*/

module.exports.replace = (edit, replace) => 
  fs.readFile("index.js", 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log("edit/replace ", edit, replace);
    var result = data.replace(/.\/dev\/itworks/g, replace);
    console.log("result: ", result);

    fs.writeFile("index.js", result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
