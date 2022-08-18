const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  INITIAL_BALANCE,
  RESERVED_NFTS,
  NFT_FEE,
} = require("../constants/constants");

describe("Fakemon Contract", () => {
  let FakemonContract, TokenContract;
  let user1;

  async function registerUser() {
    let tx = await FakemonContract.connect(user1).registerUser();
    await tx.wait();
  }

  async function mintNewNfts(noOfNftsToMint) {
    for (let i = 0; i < noOfNftsToMint; i++) {
      tx = await TokenContract.approve(
        FakemonContract.address,
        ethers.utils.parseEther(NFT_FEE.toString())
      );
      await tx.wait();

      tx = await FakemonContract.mintNewNFT({
        value: ethers.utils.parseEther(NFT_FEE.toString()),
      });
      await tx.wait();
    }
  }

  beforeEach(async () => {
    [user1] = await ethers.getSigners();

    let Token = await ethers.getContractFactory("Fmon");
    TokenContract = await Token.deploy();

    let Fakemon = await ethers.getContractFactory("Fakemon");
    FakemonContract = await Fakemon.deploy(
      TokenContract.address,
      INITIAL_BALANCE,
      RESERVED_NFTS,
      NFT_FEE
    );

    // To prevent external people to mint new tokens
    TokenContract.transferOwnership(FakemonContract.address);
  });

  describe("Deployment", () => {
    it("Should deploy properly", async () => {
      expect(await FakemonContract.initialBalance()).to.be.equal(
        INITIAL_BALANCE
      );
      expect(await FakemonContract.lastCharacterId()).to.be.equal(
        RESERVED_NFTS
      );
    });

    it("Should not mint token for random address", async () => {
      await expect(
        TokenContract.connect(user1).mintToken(user1.address, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("User registration", () => {
    beforeEach(async () => {
      expect(await FakemonContract.users(user1.address)).to.be.equal(false);
      expect(await TokenContract.balanceOf(user1.address)).to.be.equal(0);

      await registerUser();
    });

    it("Should register user", async () => {
      expect(await FakemonContract.users(user1.address)).to.be.equal(true);
      expect(await TokenContract.balanceOf(user1.address)).to.be.equal(
        ethers.utils.parseEther(INITIAL_BALANCE.toString())
      );

      const newNftId = RESERVED_NFTS + 1;
      expect(
        await FakemonContract.balanceOf(user1.address, newNftId)
      ).to.be.equal(1);

      const stats = await FakemonContract.fakemonStats(newNftId);
      // TODO: Should be tested with mock
      expect(stats.hp).to.be.equal(7);
      expect(stats.attack).to.be.equal(5);
      expect(stats.defense).to.be.equal(3);
      expect(stats.gymId).to.be.equal(0);
    });

    it("Should not register twice", async () => {
      await expect(
        FakemonContract.connect(user1).registerUser()
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Mint NFT", () => {
    beforeEach(async () => {
      await registerUser();
    });

    it("Should mint NFT", async () => {
      let tx;
      tx = await TokenContract.approve(
        FakemonContract.address,
        ethers.utils.parseEther(NFT_FEE.toString())
      );
      await tx.wait();

      tx = await FakemonContract.mintNewNFT({
        value: ethers.utils.parseEther(NFT_FEE.toString()),
      });
      await tx.wait();

      const newNftId = RESERVED_NFTS + 2;
      expect(
        await FakemonContract.balanceOf(user1.address, newNftId)
      ).to.be.equal(1);

      const stats = await FakemonContract.fakemonStats(newNftId);
      expect(stats.hp).to.be.equal(7);
      expect(stats.attack).to.be.equal(5);
      expect(stats.defense).to.be.equal(3);
      expect(stats.gymId).to.be.equal(0);
    });

    it("Should not mint without fee", async () => {
      await expect(
        FakemonContract.connect(user1).mintNewNFT()
      ).to.be.revertedWith("Transfer NFT fee and allow us to use that");
    });

    it("Should not mint without approval", async () => {
      await expect(
        FakemonContract.connect(user1).mintNewNFT({
          value: ethers.utils.parseEther("5"),
        })
      ).to.be.revertedWith("Transfer NFT fee and allow us to use that");
    });
  });

  describe("Get all fakemons", () => {
    beforeEach(async () => {
      await registerUser();
      await mintNewNfts(2);
    });

    it("Should fetch all fakemon details properly", async () => {
      const fakemons = await FakemonContract.getAllCharacters(user1.address);

      for (let i = 0; i < fakemons[0]; i++) {
        expect(fakemons[0]).to.be.equal(RESERVED_NFTS + i + 1);
        expect(fakemons[1].hp).to.be.equal(7);
        expect(fakemons[1].attack).to.be.equal(5);
        expect(fakemons[1].defense).to.be.equal(3);
        expect(fakemons[1].gymId).to.be.equal(0);
      }
    });
  });

  // TODO: Get fixed HP for testing, mocking VRF?
});
