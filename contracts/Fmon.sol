// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Fmon is Ownable, ERC20 {
    constructor() ERC20("FMON", "FakeMON Token") {}

    // Only game contract should be able to mint new token
    function mintToken(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }
}
