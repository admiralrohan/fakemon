const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fakemon Contract", () => {
  let FakemonContract, TokenContract;
  let user1;

  const INITIAL_BALANCE = "50";

  beforeEach(async () => {
    [user1] = await ethers.getSigners();

    let Token = await ethers.getContractFactory("Fmon");
    TokenContract = await Token.deploy();

    let Fakemon = await ethers.getContractFactory("Fakemon");
    FakemonContract = await Fakemon.deploy(
      TokenContract.address,
      INITIAL_BALANCE
    );
  });

  describe("Deployment", () => {
    it("Should deploy properly", async () => {
      expect(await FakemonContract.tokenAddress()).to.be.equal(
        TokenContract.address
      );
      expect(await FakemonContract.initialBalance()).to.be.equal(
        INITIAL_BALANCE
      );
    });
  });

  describe("User registration", () => {
    beforeEach(async () => {
      expect(await FakemonContract.users(user1.address)).to.be.equal(false);
      expect(await TokenContract.balanceOf(user1.address)).to.be.equal(0);

      const tx = await FakemonContract.connect(user1).registerUser();
      tx.wait();
    });

    it("Should register user", async () => {
      expect(await FakemonContract.users(user1.address)).to.be.equal(true);
      expect(await TokenContract.balanceOf(user1.address)).to.be.equal(
        ethers.utils.parseEther(INITIAL_BALANCE)
      );
    });
  });
});
