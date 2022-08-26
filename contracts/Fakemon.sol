// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFmon.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// TODO: Use consistent terminology across project eg. NFT vs Fakemon vs Character, nftFee vs fakemonFee
contract Fakemon is ERC1155 {
    // TODO: Add exp points
    mapping(address => bool) public users;
    uint public initialBalance;
    uint public battleDuration;

    IFmon private TokenContract;

    /**
     * @dev 100 NFTs are reserved for fungible game assets eg. gun, pokeball, etc
     * Used for getting ID for new NFT
     */
    uint public lastCharacterId;
    uint public lastGymId;
    uint public lastBattleId;

    mapping(uint => string) private _tokenURIs;
    // 5 $FMON
    uint public nftFee;
    // 1 $FMON
    uint public healFee;

    struct Stat {
        // TODO: Add nftId
        uint hp;
        // TODO: Add uint baseHp;
        uint attack;
        uint defense;
        // TODO: Add speed
        uint gymId; // zero if not part of a gym, so it can be staked going forward. Acting as Foreign key.
        address owner;
    }
    mapping(uint => Stat) public fakemonStats;
    mapping(address => uint[]) public characterIds;

    struct Gym {
        uint id;
        uint[] charIds; // NFTs
        bool isOpen;
        address owner;
    }
    // TODO: Should we save gymId in 2 different places, or retrieve it from `fakemonStats`
    mapping(uint => Gym) public gyms;
    uint public nftsPerGym;

    struct Battle {
        uint id;
        address attacker;
        uint gymId;
        bool isEnded; // Battle ended gracefully
        bool isWon;
        // Battle must be finished by this time, otherwise user will lose
        uint expirationTime;
    }

    mapping(uint => Battle) public battles;
    // (userId => battleId)
    mapping(address => uint) public ongoingBattle;

    // Closing gym:
    // User can close gym anytime they want. However they have to wait until all ongoing battles are finished, to get back all fakemons from the gym.

    // TODO: Add `uri`, keeping metadata onchain for now
    constructor(
        address _tokenAddress,
        uint _initialBalance,
        uint _noOfReservedNFTs,
        uint _nftFee,
        uint _nftsPerGym,
        uint _battleDuration,
        uint _healFee
    ) ERC1155("https://game.example/api/item/{id}.json") {
        TokenContract = IFmon(_tokenAddress);
        initialBalance = _initialBalance;
        lastCharacterId = _noOfReservedNFTs;
        nftFee = _nftFee * (10**TokenContract.decimals());
        nftsPerGym = _nftsPerGym;
        battleDuration = _battleDuration;
        healFee = _healFee;
    }

    function registerUser() external {
        require(!users[msg.sender], "User already registered");
        users[msg.sender] = true;

        // Upon registration assign 50 $FMON and 1 NFT
        TokenContract.mintToken(
            msg.sender,
            initialBalance * (10**TokenContract.decimals())
        );

        _mintNFT();
    }

    function getAllCharactersByUser(address _account)
        external
        view
        returns (uint[] memory, Stat[] memory)
    {
        uint[] storage _characterIds = characterIds[_account];
        Stat[] memory characters = new Stat[](_characterIds.length);
        for (uint i = 0; i < _characterIds.length; i++) {
            uint characterId = _characterIds[i];
            characters[i] = fakemonStats[characterId];
        }
        return (_characterIds, characters);
    }

    // TODO: Get all gyms by user
    function getAllGyms() external view returns (Gym[] memory) {
        Gym[] memory gymList = new Gym[](lastGymId);
        for (uint i = 1; i <= lastGymId; i++) {
            gymList[i - 1] = gyms[i];
        }
        return gymList;
    }

    function getAllCharactersByGym(uint _gymId)
        external
        view
        returns (uint[] memory, Stat[] memory)
    {
        uint[] storage _characterIds = gyms[_gymId].charIds;
        // TODO: Modularize
        Stat[] memory characters = new Stat[](_characterIds.length);
        for (uint i = 0; i < _characterIds.length; i++) {
            uint characterId = _characterIds[i];
            characters[i] = fakemonStats[characterId];
        }
        return (_characterIds, characters);
    }

    function mintNewNFT() external payable {
        // Checking allownace balance instead of wallet balance, as I can't use wallet balance directly
        require(
            TokenContract.allowance(msg.sender, address(this)) >= nftFee,
            "Approve us to use NFT fee"
        );

        TokenContract.transferFrom(msg.sender, address(this), nftFee);
        _mintNFT();
    }

    function _mintNFT() internal {
        lastCharacterId += 1;
        _mint(msg.sender, lastCharacterId, 1, "");
        characterIds[msg.sender].push(lastCharacterId);

        // TODO: Use random number for HP
        // TODO: Use decentralized VRF for this stat allocation
        // TODO: Reduce quality of free NFT
        fakemonStats[lastCharacterId] = Stat(7, 5, 3, 0, msg.sender);
    }

    function createNewGym(uint[] memory _nftIds) external {
        lastGymId += 1;

        require(_nftIds.length > 0, "Need atleast one unstacked NFT");
        // TODO: Add max limit in error string
        require(_nftIds.length <= nftsPerGym, "Max NFT per gym limit breached");

        // Check if all NFTs are unlocked
        for (uint i = 0; i < _nftIds.length; i++) {
            require(
                fakemonStats[_nftIds[i]].owner == msg.sender,
                "All NFTs need to be owned by user"
            );
            require(
                fakemonStats[_nftIds[i]].gymId == 0,
                "All NFTs need to be unlocked"
            );

            fakemonStats[_nftIds[i]].gymId = lastGymId;
        }

        gyms[lastGymId] = Gym(lastGymId, _nftIds, true, msg.sender);
    }

    function startBattle(uint _gymId) external {
        require(ongoingBattle[msg.sender] == 0, "First finish existing battle");

        lastBattleId += 1;
        battles[lastBattleId] = Battle(
            lastBattleId,
            msg.sender,
            _gymId,
            false,
            false,
            block.timestamp + battleDuration
        );
        ongoingBattle[msg.sender] = lastBattleId;
    }

    function fleeBattle() external {
        uint currentBattleId = ongoingBattle[msg.sender];
        require(currentBattleId > 0, "Don't have any ongoing battle");

        // Expiration time won't matter as user is closing it
        battles[currentBattleId].isEnded = true;

        // TODO: Remove it later
        healFakemons(characterIds[msg.sender]);
        healFakemons(gyms[battles[ongoingBattle[msg.sender]].gymId].charIds);

        ongoingBattle[msg.sender] = 0;
    }

    function endBattle() external {
        require(ongoingBattle[msg.sender] > 0, "Don't have any ongoing battle");

        // TODO: Remove it later
        healFakemons(characterIds[msg.sender]);
        healFakemons(gyms[battles[ongoingBattle[msg.sender]].gymId].charIds);

        ongoingBattle[msg.sender] = 0;
    }

    // Current logic: Fight all fakemons of defending gym until it exhausts
    function attack(uint _attackerId) external {
        uint _battleId = ongoingBattle[msg.sender];
        require(_battleId > 0, "No ongoing battle");

        Battle storage battle = battles[_battleId];
        require(block.timestamp < battle.expirationTime, "Battle expired");

        Gym storage gym = gyms[battle.gymId];

        Stat storage _attacker = fakemonStats[_attackerId];
        // Fight logic: Both attacker and defender will lose 1 HP each until one exhausts
        for (uint i = 0; i < gym.charIds.length; i++) {
            if (_attacker.hp == 0) {
                break;
            }

            uint _defenderId = gym.charIds[i];
            Stat storage _defender = fakemonStats[_defenderId];

            if (_defender.hp == 0) {
                continue;
            }

            uint _winnerId = _attacker.hp > _defender.hp
                ? _attackerId
                : _defenderId;
            uint hpLostInBattle = fakemonStats[_winnerId].hp;

            fakemonStats[_attackerId].hp -= hpLostInBattle;
            fakemonStats[_defenderId].hp -= hpLostInBattle;

            // If last fakemon of the gym has no HP, battle is won by user
            if (
                i == gym.charIds.length - 1 && fakemonStats[_defenderId].hp == 0
            ) {
                battle.isEnded = true;
                battle.isWon = true;
            }
        }
    }

    // TODO: Activate this, using autoheal for now. Make this `external`
    function healFakemons(uint[] memory _fakemonIds) internal {
        require(_fakemonIds.length > 0, "Need atleast one fakemon to heal");

        // uint requiredFee = healFee * _fakemonIds.length;
        // require(
        //     TokenContract.allowance(msg.sender, address(this)) >= requiredFee,
        //     "Approve us to use healing fee"
        // );

        // TokenContract.transferFrom(msg.sender, address(this), requiredFee);
        for (uint i = 0; i < _fakemonIds.length; i++) {
            require(fakemonStats[i].gymId == 0, "Can't heal staked fakemons");
            // TODO: Keep initial HP in storage
            fakemonStats[_fakemonIds[i]].hp = 7;
        }
    }

    function getCurrentBattleDetails() external view returns (Battle memory) {
        return battles[ongoingBattle[msg.sender]];
    }
}
