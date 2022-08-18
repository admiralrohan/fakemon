const hre = require("hardhat");
const fs = require("fs");
const {
  INITIAL_BALANCE,
  RESERVED_NFTS,
  NFT_FEE,
  NFTS_PER_GYM,
} = require("../constants/constants");

async function main() {
  // We get the contracts to deploy
  const Token = await hre.ethers.getContractFactory("Fmon");
  const Fakemon = await hre.ethers.getContractFactory("Fakemon");

  const TokenContract = await Token.deploy();
  const FakemonContract = await Fakemon.deploy(
    TokenContract.address,
    INITIAL_BALANCE,
    RESERVED_NFTS,
    NFT_FEE,
    NFTS_PER_GYM
  );

  console.log("Token contract deployed to:", TokenContract.address);
  console.log("Fakemon contract deployed to:", FakemonContract.address);

  // To prevent external people to mint new tokens
  await TokenContract.transferOwnership(FakemonContract.address);
  console.log("Token contract's owner changed to Fakemon contract");

  // Copy contract details to frontend directory
  const TokenArtifact = hre.artifacts.readArtifactSync("Fmon");
  const FakemonArtifact = hre.artifacts.readArtifactSync("Fakemon");

  // TODO: Use a different folder for different envs eg. localhost, testnet, mainnet
  // Otherwise during local development previous artifact from different env will be overwritten
  // And push the artifacts in git
  const contractDir = __dirname + "/../frontend/src/artifacts/contracts";
  if (!fs.existsSync(contractDir))
    fs.mkdirSync(contractDir, { recursive: true });

  fs.writeFileSync(
    contractDir + "/fmon.json",
    JSON.stringify(
      { address: TokenContract.address, abi: TokenArtifact.abi },
      undefined,
      2
    )
  );
  fs.writeFileSync(
    contractDir + "/fakemon.json",
    JSON.stringify(
      { address: FakemonContract.address, abi: FakemonArtifact.abi },
      undefined,
      2
    )
  );

  console.log("Save contract artifacts in Frontend folder");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
