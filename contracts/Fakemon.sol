// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFmon.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Fakemon is ERC1155 {
    // TODO: Add exp points
    mapping(address => bool) public users;
    // address public tokenAddress;
    uint public initialBalance;

    IFmon private TokenContract;

    /**
     * @dev 100 NFTs are reserved for fungible game assets eg. gun, pokeball, etc
     * Used for getting ID for new NFT
     */
    uint public lastCharacterId;
    mapping(uint => string) private _tokenURIs;
    // 5 $FMON
    uint public nftFee;

    struct Stat {
        uint hp;
        uint attack;
        uint defense;
    }
    mapping(uint => Stat) public fakemonStats;

    // mapping(uint => Stat) public battles;
    mapping(address => uint[]) public characterIds;

    // TODO: Add `uri`, keeping metadata onchain for now
    constructor(
        address _tokenAddress,
        uint _initialBalance,
        uint _noOfReservedNFTs,
        uint _nftFee
    ) ERC1155("https://game.example/api/item/{id}.json") {
        TokenContract = IFmon(_tokenAddress);
        // tokenAddress = _tokenAddress;
        initialBalance = _initialBalance;
        lastCharacterId = _noOfReservedNFTs;
        nftFee = _nftFee * (10**IFmon(_tokenAddress).decimals());
    }

    function registerUser() external {
        require(!users[msg.sender], "User already registered");
        users[msg.sender] = true;

        // Upon registration assign 50 $FMON and 1 NFT
        // IFmon TokenContract = IFmon(tokenAddress);
        TokenContract.mintToken(
            msg.sender,
            initialBalance * (10**TokenContract.decimals())
        );

        _mintNFT();
    }

    // TODO: Use this to get all NFTs from user
    function getAllCharacters(address _account)
        external
        view
        returns (Stat[] memory)
    {
        uint[] storage _characterIds = characterIds[_account];
        Stat[] memory characters = new Stat[](_characterIds.length);
        for (uint i = 0; i < _characterIds.length; i++) {
            uint characterId = _characterIds[i];
            characters[i] = fakemonStats[characterId];
        }
        return characters;
        // return characterIds[_account];
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
            msg.value >= nftFee &&
                TokenContract.allowance(msg.sender, address(this)) >= nftFee,
            "Transfer NFT fee and allow us to use that"
        );

        TokenContract.transferFrom(msg.sender, address(this), nftFee);
        _mintNFT();
    }

    function _mintNFT() internal {
        lastCharacterId += 1;
        _mint(msg.sender, lastCharacterId, 1, "");
        // TODO: Use random number for HP
        // TODO: Use decentralized VRF for this stat allocation
        // TODO: Reduce quality of free NFT
        fakemonStats[lastCharacterId] = Stat(7, 5, 3);
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._afterTokenTransfer(operator, from, to, ids, amounts, data);
        characterIds[to].push(ids[0]);
    }
}
