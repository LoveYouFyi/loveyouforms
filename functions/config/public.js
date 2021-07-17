/*------------------------------------------------------------------------------
ENVIRONMENT VARIABLE KEYS
Firebase local development emulator does not set process.env.NODE_ENV, but the
cloud server does set process.env.NODE_ENV as 'production' (deployed functions).
---> See the the conditional module.exports statement below...

DEV VS PROD NODE MODULE 'loveyouforms'
The primary Firebase cloud functions file needs to conditionally include the
'loveyouforms' module from either ./dev/loveyouforms-package or the default
location of ./node_modules/loveyouforms ... the below devKeys and prodKeys
objects include the file path references accordingly.

PUBLIC KEYS
To add additional keys that can be included in the public repository, add them
below.

PRIVATE KEYS (specific to dev & prod environments)
To add keys that should not be included in the public repository:
Private config files are ignored by git as: dev.js and prod.js

1) Add a new key file to this directory as one or both of
  dev.js
  prod.js
2) Within the added files, export an object with the keys, e.g.
  module.exports = {
    keys: {
      myProdKey: "hee hee hee"
    }
  }
------------------------------------------------------------------------------*/

// If file exists return it
const config = path => {
  // require is synchronous, can wrap in try catch so if file does not exist...
  try {
    const config = require(path)
    return config
  } catch(e) {
    return undefined
  }
}

// Dev Config
let devConfig = config('./dev.js')
devConfig = {
  requireLoveYouFormsFrom: './dev/loveyouforms-package',
  ...devConfig && { ...devConfig }
}

// Prod Config
let prodConfig = config('./prod.js')
prodConfig = {
  requireLoveYouFormsFrom: 'loveyouforms',
  ...prodConfig && { ...prodConfig }
}

// Conditionally export devKeys or prodKeys
if (process.env.NODE_ENV === "production") {
  module.exports = prodKeys
} else {
  module.exports = devConfig
}
