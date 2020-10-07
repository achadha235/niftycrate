// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "./NiftyCrate.sol";
import "./NiftyRanking.sol";

contract NiftyCrateOpener {
    mapping(uint256 => uint256) private _tokenNonce;

    mapping(address => uint256[]) private _addressNonces;

    uint256 private _addressNonce;

    uint256 private _globalNonce;

    address private _niftyRanking;

    constructor(address _rankingContractAddr) public {
        _niftyRanking = _rankingContractAddr;
    }

    function generateNonces(uint256 numberOfNonces) public {
        require(numberOfNonces > 0);
        for (uint256 i = 0; i < numberOfNonces; i++) {
            _addressNonces[msg.sender].push(_addressNonce);
            _addressNonce++;
        }
    }

    function numberOfNonces(address _for) public view returns (uint256) {
        return _addressNonces[_for].length;
    }

    function _getUserNonce(address _for) private returns (uint256) {
        uint256 len = _addressNonces[_for].length;
        require(len > 0);
        uint256 currentNonce = _addressNonces[_for][0];
        if (_addressNonces[_for].length > 1) {
            uint256 last = _addressNonces[_for][len - 1];
            _addressNonces[_for][0] = last;
        }
        _addressNonces[_for].pop();
        return currentNonce;
    }

    function open(
        address _for,
        uint256 _tokenId,
        uint256 _data
    )
        public
        returns (
            bool,
            address,
            uint256
        )
    {
        uint256 numChildren = NiftyCrate(msg.sender).numberOfChildren(_tokenId);
        require(numChildren > 0);
        uint256 nonce = _randomUserTokenNonce(_for, _tokenId, _data);
        uint256 entryIndex = nonce % numChildren;
        for (uint256 i = 0; i < numChildren; i++) {
            uint256 selectedIndex = (entryIndex + i) % numChildren;
            (address childAddress, uint256 childId) = NiftyCrate(msg.sender)
                .childAtIndex(_tokenId, selectedIndex);
            uint32 rank = NiftyRanking(_niftyRanking).tokenRanking(
                childAddress,
                childId
            );
            if (i == 0 && (rank == 0 || uint32(nonce) < rank)) {
                return (true, childAddress, childId);
            } else if (rank == 0) {
                return (true, childAddress, childId);
            }
        }
        return (false, address(0), 0);
    }

    function _randomUserTokenNonce(
        address _for,
        uint256 _tokenId,
        uint256
    ) private returns (uint256) {
        uint256 nonce = uint256(
            keccak256(
                abi.encode(
                    _globalNonce,
                    _tokenNonce[_tokenId],
                    blockhash(block.number - 1),
                    _getUserNonce(_for)
                )
            )
        );

        _tokenNonce[_tokenId]++;
        _globalNonce++;
        return nonce;
    }
}
