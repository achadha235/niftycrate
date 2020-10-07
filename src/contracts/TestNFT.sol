// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    constructor(string memory _name, string memory _symbol)
        public
        ERC721(_name, _symbol)
    {}

    function mint(uint256 _tokenId) public {
        _mint(msg.sender, _tokenId);
    }

    function mint(uint256[] memory _tokenIds) public {
        require(_tokenIds.length > 0, "You must mint at least one token");
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _mint(msg.sender, _tokenIds[i]);
        }
    }
}
