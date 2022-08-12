// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Fmon is ERC20 {
    constructor() ERC20("FMON", "FakeMON Token") {}

    function faucet(address to, uint amount) external {
        // TODO: Prevent anyone calling this
        // I want to only let Fakemon contract to call it, but what about circular dependency?
        _mint(to, amount);
    }
}
