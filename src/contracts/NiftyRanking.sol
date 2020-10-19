// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NiftyRanking {
  mapping(address => mapping(uint256 => uint32)) public tokenRanking;

  event TokenRankingSet(address, uint256, uint256, address);

  function setTokenRanking(
    address _tokenAddress,
    uint256 _tokenId,
    uint32 _rank
  ) public virtual {
    // todo: override this function with check for crate open. should set only if owner and crate open
    require(_rank > 0 && _rank < uint32(0xffffffff));
    tokenRanking[_tokenAddress][_tokenId] = _rank;
    emit TokenRankingSet(_tokenAddress, _tokenId, _rank, msg.sender);
  }
}
