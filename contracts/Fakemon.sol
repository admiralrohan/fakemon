// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFmon.sol";

contract Fakemon {
    mapping(address => bool) public users;
    address public tokenAddress;
    uint public initialBalance;

    constructor(address _tokenAddress, uint _initialBalance) {
        tokenAddress = _tokenAddress;
        initialBalance = _initialBalance;
    }

    function registerUser() external {
        require(!users[msg.sender], "User already registered");

        users[msg.sender] = true;
        IFmon TokenContract = IFmon(tokenAddress);
        TokenContract.faucet(
            msg.sender,
            initialBalance * (10**TokenContract.decimals())
        );
    }
}
