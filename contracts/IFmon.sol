// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IFmon {
    function mintToken(address to, uint amount) external;

    function decimals() external returns (uint8);
}
