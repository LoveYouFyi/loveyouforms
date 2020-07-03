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
Private keys files are ignored by git as: keys.dev.js and keys.prod.js

1) Add a new key file to this directory as one or both of
  keys.dev.js
  keys.prod.js
2) Within the added files, export an object with the keys, e.g.
  module.exports = {
    myProdKey: "hee hee hee"
  }
------------------------------------------------------------------------------*/

// If file exists return it
const file = file => {
  // require is synchronous so can simply wrap it with a try/catch
  try {
    return require(file)
  } catch (err) {
    return undefined;
  }
}

// Prod Keys
const prodKeysFile = file('./keys.prod.js');
const prodKeys = {
  requireLoveYouFormsFrom: 'loveyouforms',
  ...prodKeysFile && { ...prodKeysFile }
}

// Dev Keys
const devKeysFile = file('./keys.dev.js');
const devKeys = {
  requireLoveYouFormsFrom: './dev/loveyouforms-package',
  ...devKeysFile && { ...devKeysFile }
}

// Conditionally export devKeys or prodKeys
if (process.env.NODE_ENV === "production") {
  module.exports = prodKeys;
} else {
  module.exports = devKeys;
}
