
const devKeys = {
  loveyouforms: './dev/loveyouforms-package',
}
const prodKeys = {
  loveyouforms: 'loveyouforms',
}

if (process.env.NODE_ENV === "production") {
  module.exports = prodKeys;
} else {
  module.exports = devKeys;
}