const { expect } = require("chai");
const { ethers } = require("hardhat");
const { NFT_FEE, RESERVED_NFTS } = require("../constants/constants");

function testHelpers(FakemonContract, TokenContract, user1, user2) {
  async function registerUser(signer = user1) {
    const tx = await FakemonContract.connect(signer).registerUser();
    await tx.wait();
  }

  async function mintNewNfts(noOfNftsToMint = 1, signer = user1) {
    for (let i = 0; i < noOfNftsToMint; i++) {
      let tx = await TokenContract.connect(signer).approve(
        FakemonContract.address,
        ethers.utils.parseEther(NFT_FEE.toString())
      );
      await tx.wait();

      tx = await FakemonContract.connect(signer).mintNewNFT();
      await tx.wait();
    }
  }
  async function createNewGym(nftIds, signer = user1) {
    const tx = await FakemonContract.connect(signer).createNewGym(nftIds);
    await tx.wait();
  }

  // @param `expectedNftState` - desired `gymId` in `fakemonStats`
  async function checkGymIdInNftStatsMapping(expectedNftState) {
    for (let i = 0; i < 4; i++) {
      expect(
        (await FakemonContract.fakemonStats(RESERVED_NFTS + i + 1)).gymId
      ).to.be.equal(expectedNftState[i]);
    }
  }

  return {
    registerUser,
    mintNewNfts,
    createNewGym,
    checkGymIdInNftStatsMapping,
  };
}

async function getBlockTimestamp() {
  return (await ethers.provider._getBlock()).timestamp;
}

module.exports = { testHelpers, getBlockTimestamp };
