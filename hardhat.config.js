require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
const { deployContracts } = require("./scripts/deploy");

const PROVIDER_URL = process.env.PROVIDER_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

// Available networks: localhost, rinkeby
task("deploy", "Deploy all contracts").setAction(async () => {
  await deployContracts(hre.network.name);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: { mining: { auto: true, interval: 0 } },
    rinkeby: {
      url: PROVIDER_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
};
