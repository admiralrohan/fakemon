// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IFmon {
    function decimals() external returns (uint8);

    // function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function mintToken(address to, uint amount) external;
}
