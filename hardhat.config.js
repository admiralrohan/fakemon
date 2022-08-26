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
  defaultNetwork: "localhost",
  networks: {
    rinkeby: {
      url: PROVIDER_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
};
