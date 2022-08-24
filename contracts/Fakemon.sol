// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFmon.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// TODO: Use consistent terminology eg. NFT vs Fakemon vs Character. nftFee vs fakemonFee
contract Fakemon is ERC1155 {
    // TODO: Add exp points
    mapping(address => bool) public users;
    uint public initialBalance;

    IFmon private TokenContract;

    /**
     * @dev 100 NFTs are reserved for fungible game assets eg. gun, pokeball, etc
     * Used for getting ID for new NFT
     */
    uint public lastCharacterId;
    uint public lastGymId;
    mapping(uint => string) private _tokenURIs;
    // 5 $FMON
    uint public nftFee;

    struct Stat {
        // TODO: Add nftId
        uint hp;
        uint attack;
        uint defense;
        // TODO: Add speed
        uint gymId; // zero if not part of a gym, so it can be staked going forward. Acting as Foreign key.
        address owner;
    }
    mapping(uint => Stat) public fakemonStats;

    // mapping(uint => Stat) public battles;
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

    // TODO: Add `uri`, keeping metadata onchain for now
    constructor(
        address _tokenAddress,
        uint _initialBalance,
        uint _noOfReservedNFTs,
        uint _nftFee,
        uint _nftsPerGym
    ) ERC1155("https://game.example/api/item/{id}.json") {
        TokenContract = IFmon(_tokenAddress);
        initialBalance = _initialBalance;
        lastCharacterId = _noOfReservedNFTs;
        nftFee = _nftFee * (10**TokenContract.decimals());
        nftsPerGym = _nftsPerGym;
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

    // Returns winner ID
    // TODO: Either write attack result into BC state, or change fn name to `getAttackOutcome`
    function attack(uint _attackerId, uint _defenderId)
        external
        view
        returns (uint)
    {
        // TODO: Make modifier
        require(!users[msg.sender], "User already registered");

        Stat storage attacker = fakemonStats[_attackerId];
        Stat storage defender = fakemonStats[_defenderId];

        // Battle logic: Attacker's HP must be greater than defender's
        // TODO: Improve battle logic
        return attacker.hp > defender.hp ? _attackerId : _defenderId;
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

    function createNewGym(uint[] memory nftIds) external {
        lastGymId += 1;

        require(nftIds.length > 0, "Need atleast one unstacked NFT");
        // TODO: Add max limit in error string
        require(nftIds.length <= nftsPerGym, "Max NFT per gym limit breached");

        // Check if all NFTs are unlocked
        for (uint i = 0; i < nftIds.length; i++) {
            require(
                fakemonStats[nftIds[i]].owner == msg.sender,
                "All NFTs need to be owned by user"
            );
            require(
                fakemonStats[nftIds[i]].gymId == 0,
                "All NFTs need to be unlocked"
            );

            fakemonStats[nftIds[i]].gymId = lastGymId;
        }

        gyms[lastGymId] = Gym(lastGymId, nftIds, true, msg.sender);
    }
}
