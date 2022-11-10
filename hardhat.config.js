require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
const { deployContracts } = require("./scripts/deploy");

const { PROVIDER_URL, WALLET_PRIVATE_KEY } = process.env;

// Available networks: hardhat, goerli
task("deploy", "Deploy all contracts").setAction(async () => {
  await deployContracts(hre.network.name);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: { mining: { auto: true, interval: 0 } },
    goerli: {
      url: PROVIDER_URL,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
};
