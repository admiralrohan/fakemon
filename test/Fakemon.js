const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  INITIAL_BALANCE,
  RESERVED_NFTS,
  NFT_FEE,
  NFTS_PER_GYM,
  BATTLE_DURATION,
  HEAL_FEE,
} = require("../constants/constants");
const { testHelpers, getBlockTimestamp } = require("../utils/helper");

// TODO: Get fixed HP for testing, mocking VRF?
describe("Fakemon Contract", () => {
  let FakemonContract, TokenContract;
  let user1, user2;

  let registerUser, mintNewNfts, createNewGym, checkGymIdInNftStatsMapping;

  beforeEach(async () => {
    [user1, user2] = await ethers.getSigners();

    let Token = await ethers.getContractFactory("Fmon");
    TokenContract = await Token.deploy();

    let Fakemon = await ethers.getContractFactory("Fakemon");
    FakemonContract = await Fakemon.deploy(
      TokenContract.address,
      INITIAL_BALANCE,
      RESERVED_NFTS,
      NFT_FEE,
      NFTS_PER_GYM,
      BATTLE_DURATION,
      HEAL_FEE
    );

    // To prevent external people to mint new tokens
    const tx = await TokenContract.transferOwnership(FakemonContract.address);
    await tx.wait();

    ({ registerUser, mintNewNfts, createNewGym, checkGymIdInNftStatsMapping } =
      testHelpers(FakemonContract, TokenContract, user1, user2));
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
      await mintNewNfts();

      const lastNftId = RESERVED_NFTS + 2;
      expect(
        await FakemonContract.balanceOf(user1.address, lastNftId)
      ).to.be.equal(1);

      const stats = await FakemonContract.fakemonStats(lastNftId);
      expect(stats.hp).to.be.equal(7);
      expect(stats.attack).to.be.equal(5);
      expect(stats.defense).to.be.equal(3);
      expect(stats.gymId).to.be.equal(0);
    });

    it("Should not mint without fee", async () => {
      await expect(
        FakemonContract.connect(user1).mintNewNFT()
      ).to.be.revertedWith("Approve us to use NFT fee");
    });

    it("Should not mint without approval", async () => {
      await expect(
        FakemonContract.connect(user1).mintNewNFT()
      ).to.be.revertedWith("Approve us to use NFT fee");
    });
  });

  describe("Fakemon details", () => {
    beforeEach(async () => {
      await registerUser();
      await mintNewNfts(2);
    });

    it("Should fetch all fakemon details properly", async () => {
      const fakemons = await FakemonContract.getAllCharactersByUser(
        user1.address
      );

      for (let i = 0; i < fakemons[0].length; i++) {
        expect(fakemons[0][i]).to.be.equal(RESERVED_NFTS + i + 1);
        expect(fakemons[1][i].hp).to.be.equal(7);
        expect(fakemons[1][i].attack).to.be.equal(5);
        expect(fakemons[1][i].defense).to.be.equal(3);
        expect(fakemons[1][i].gymId).to.be.equal(0);
      }
    });
  });

  describe("Gyms", () => {
    beforeEach(async () => {
      await registerUser(user1); // nftId = RESERVED_NFTS + 1
      await mintNewNfts(3, user1); // +2, 3, 4

      await registerUser(user2); // +5
      await mintNewNfts(3, user2); // +6, 7, 8
    });

    it("Should create new gym", async () => {
      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);

      await checkGymIdInNftStatsMapping([1, 1, 0, 0]);
    });

    it("Should be able to create multiple gyms by same user", async () => {
      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await createNewGym([RESERVED_NFTS + 3], user1);

      await checkGymIdInNftStatsMapping([1, 1, 2, 0]);
    });

    it("Should not create gym without any NFT", async () => {
      await expect(
        FakemonContract.connect(user1).createNewGym([])
      ).to.be.revertedWith("Need atleast one unstacked NFT");

      // Check if still maintains the old state after tx failure
      await checkGymIdInNftStatsMapping([0, 0, 0, 0]);
    });

    it("Should not create gym with more than NFT limit", async () => {
      await expect(
        FakemonContract.connect(user1).createNewGym([
          RESERVED_NFTS + 1,
          RESERVED_NFTS + 2,
          RESERVED_NFTS + 3,
          RESERVED_NFTS + 4,
        ])
      ).to.be.revertedWith("Max NFT per gym limit breached");

      await checkGymIdInNftStatsMapping([0, 0, 0, 0]);
    });

    it("Should not create gym with other user's NFTs", async () => {
      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await expect(
        FakemonContract.connect(user1).createNewGym([RESERVED_NFTS + 5])
      ).to.be.revertedWith("All NFTs need to be owned by user");

      // Check if still maintains the old state after tx failure
      await checkGymIdInNftStatsMapping([1, 1, 0, 0, 0]);
    });

    it("Should not create gym with reserved NFTs", async () => {
      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await expect(
        FakemonContract.connect(user1).createNewGym([RESERVED_NFTS - 2])
      ).to.be.revertedWith("All NFTs need to be owned by user");

      await checkGymIdInNftStatsMapping([1, 1, 0, 0]);
    });

    it("Should not create gym with uncreated NFTs", async () => {
      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await expect(
        FakemonContract.connect(user1).createNewGym([RESERVED_NFTS + 20])
      ).to.be.revertedWith("All NFTs need to be owned by user");

      await checkGymIdInNftStatsMapping([1, 1, 0, 0]);
    });

    it("Should not create gym with locked NFTs", async () => {
      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await expect(
        FakemonContract.connect(user1).createNewGym([RESERVED_NFTS + 2])
      ).to.be.revertedWith("All NFTs need to be unlocked");

      await checkGymIdInNftStatsMapping([1, 1, 0, 0]);
    });
  });

  describe("Gym details", () => {
    beforeEach(async () => {
      await registerUser(user1);
      await mintNewNfts(2, user1);

      await registerUser(user2);
      await mintNewNfts(2, user2);

      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await createNewGym([RESERVED_NFTS + 5, RESERVED_NFTS + 6], user2);
    });

    it("Should fetch all gym details properly", async () => {
      const gyms = await FakemonContract.getAllGyms();

      expect(gyms.length).to.be.equal(2);

      expect(gyms[0].id).to.be.equal(1);
      expect(gyms[0].charIds).to.be.deep.equal([
        RESERVED_NFTS + 1,
        RESERVED_NFTS + 2,
      ]);
      expect(gyms[0].isOpen).to.be.equal(true);
      expect(gyms[0].owner).to.be.equal(user1.address);

      expect(gyms[1].id).to.be.equal(2);
      expect(gyms[1].charIds).to.be.deep.equal([
        RESERVED_NFTS + 5,
        RESERVED_NFTS + 6,
      ]);
      expect(gyms[1].isOpen).to.be.equal(true);
      expect(gyms[1].owner).to.be.equal(user2.address);
    });

    it("Should fetch all fakemons for a gym", async () => {
      let fakemons = await FakemonContract.getAllCharactersByGym(1);
      for (let i = 0; i < fakemons[0].length; i++) {
        expect(fakemons[0][i]).to.be.equal(RESERVED_NFTS + i + 1);
        expect(fakemons[1][i].hp).to.be.equal(7);
        expect(fakemons[1][i].attack).to.be.equal(5);
        expect(fakemons[1][i].defense).to.be.equal(3);
        expect(fakemons[1][i].gymId).to.be.equal(1);
      }

      fakemons = await FakemonContract.getAllCharactersByGym(2);
      for (let i = 0; i < fakemons[0].length; i++) {
        expect(fakemons[0][i]).to.be.equal(RESERVED_NFTS + i + 5);
        expect(fakemons[1][i].hp).to.be.equal(7);
        expect(fakemons[1][i].attack).to.be.equal(5);
        expect(fakemons[1][i].defense).to.be.equal(3);
        expect(fakemons[1][i].gymId).to.be.equal(2);
      }
    });
  });

  describe("Battle", () => {
    beforeEach(async () => {
      await registerUser(user1);
      await mintNewNfts(2, user1);

      await registerUser(user2);
      await mintNewNfts(2, user2);

      await createNewGym([RESERVED_NFTS + 1, RESERVED_NFTS + 2], user1);
      await createNewGym([RESERVED_NFTS + 5, RESERVED_NFTS + 6], user2);
    });

    it("Should create battle against any gym", async () => {
      const tx = await FakemonContract.connect(user1).startBattle(1);
      await tx.wait();

      expect(await FakemonContract.ongoingBattle(user1.address)).to.be.equal(1);

      const battle = await FakemonContract.battles(1);
      expect(battle.id).to.be.equal(1);
      expect(battle.attacker).to.be.equal(user1.address);
      expect(battle.gymId).to.be.equal(1);
      expect(battle.isEnded).to.be.equal(false);
      expect(battle.isWon).to.be.equal(false);
      expect(battle.expirationTime).to.be.equal(
        (await getBlockTimestamp()) + BATTLE_DURATION
      );
    });

    it("Should not create multiple battles at same time", async () => {
      const tx = await FakemonContract.connect(user1).startBattle(1);
      await tx.wait();

      await expect(
        FakemonContract.connect(user1).startBattle(2)
      ).to.be.revertedWith("First finish existing battle");

      expect(await FakemonContract.ongoingBattle(user1.address)).to.be.equal(1);
    });

    it("Should be able to flee from any battle", async () => {
      let tx = await FakemonContract.connect(user1).startBattle(1);
      await tx.wait();

      tx = await FakemonContract.connect(user1).fleeBattle();
      await tx.wait();

      expect((await FakemonContract.battles(1)).isEnded).to.be.true;
      expect(await FakemonContract.ongoingBattle(user1.address)).to.be.equal(0);
    });

    it("Should not flee when no battle is ongoing", async () => {
      await expect(
        FakemonContract.connect(user1).fleeBattle()
      ).to.be.revertedWith("Don't have any ongoing battle");

      expect(await FakemonContract.ongoingBattle(user1.address)).to.be.equal(0);
    });

    it("Should return gym ID of current battle properly", async () => {
      expect(
        (await FakemonContract.connect(user1).getCurrentBattleDetails()).gymId
      ).to.be.equal(0);

      let tx = await FakemonContract.connect(user1).startBattle(1);
      await tx.wait();

      expect(
        (await FakemonContract.connect(user1).getCurrentBattleDetails()).gymId
      ).to.be.equal(1);

      tx = await FakemonContract.connect(user1).fleeBattle();
      await tx.wait();
      tx = await FakemonContract.connect(user1).startBattle(2);
      await tx.wait();

      expect(
        (await FakemonContract.connect(user1).getCurrentBattleDetails()).gymId
      ).to.be.equal(2);
    });
  });
});
