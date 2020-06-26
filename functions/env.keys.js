const publicIp = require('public-ip');

/*
(async () => {

  if (await publicIp.v4()) {
    myIp = await publicIp.v4()
  } else if (await publicIp.v6()) {
    myIp = await publicIp.v6()
  }
})();
*/

const myIp = async () => {
  const v4 = await publicIp.v4();
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", v4);

  if (v4) {
    return v4;
  } else if (!v4) {
    const v6 = await publicIp.v6();
    if (v6) {
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", v6);
      return v6;
    }
  } else {
    console.info("IP Address not found!")
  }
}
//ip();
myIp();


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