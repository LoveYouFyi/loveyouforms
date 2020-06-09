var fs = require('fs')

/*------------------------------------------------------------------------------
  run file import from command-line: 
  $ node -e 'require("./replace.js").replace'
------------------------------------------------------------------------------*/

module.exports.replace = fs.readFile("index.js", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/loveyouforms-package/g, 'itworks');

  fs.writeFile("index.js", result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
