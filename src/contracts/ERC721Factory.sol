// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./TestNFT.sol";

contract ERC721Factory {
    constructor() public {}

    event TokenCreated(address tokenAddress);

    function deployToken(string memory _name, string memory _symbol)
        public
        returns (address)
    {
        address newTokenAddress = address(new TestNFT(_name, _symbol));
        emit TokenCreated(newTokenAddress);
        return newTokenAddress;
    }
}
