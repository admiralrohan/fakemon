require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
const { deployContracts } = require("./scripts/deploy");

const { PROVIDER_URL, WALLET_PRIVATE_KEY } = process.env;

// Available networks: hardhat, goerli
task("deploy", "Deploy all contracts").setAction(async () => {
  // To keep artifacts
  const folderName =
    hre.network.name === "localhost" ? "hardhat" : hre.network.name;
  const isAutomineOn =
    hre.network.name === "localhost" &&
    hre.userConfig.networks.hardhat.mining.auto;

  await deployContracts(folderName, isAutomineOn);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: { mining: { auto: false, interval: 2000 } },
    goerli: {
      url: PROVIDER_URL,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
};
