// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./SenderAccessControl.sol";
import "./interfaces/ITopDownComposable.sol";

contract TopDownComposable is ERC721, ITopDownComposable, SenderAccessControl {
    struct OwnedNFT {
        uint256 tokenId;
        address tokenAddress;
    }

    // Implements the wallet interface for ERC721
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
    bytes4 constant ERC721_RECEIVED = 0x150b7a02;

    bytes4 constant ERC721_RECEIVED_LEGACY = 0xf0b9e5ba;

    mapping(address => mapping(uint256 => bool)) _tokenIsComposed;

    mapping(uint256 => OwnedNFT[]) private _ownedTokens;

    mapping(address => mapping(uint256 => uint256)) private _tokenParent;

    mapping(address => mapping(uint256 => uint256)) private _ownedTokenIndex;

    constructor(string memory _name, string memory _symbol)
        public
        ERC721(_name, _symbol)
    {}

    function numberOfChildren(uint256 _parentId)
        public
        override
        view
        returns (uint256)
    {
        require(_exists(_parentId));
        return _ownedTokens[_parentId].length;
    }

    function parentToken(address _tokenAddress, uint256 _tokenId)
        public
        override
        view
        returns (
            bool,
            uint256,
            uint256
        )
    {
        if (_tokenIsComposed[_tokenAddress][_tokenId]) {
            return (false, 0, 0);
        } else {
            return (
                true,
                _tokenParent[_tokenAddress][_tokenId],
                _ownedTokenIndex[_tokenAddress][_tokenId]
            );
        }
    }

    function childAtIndex(uint256 _parentId, uint256 _childIndex)
        public
        override
        view
        returns (address, uint256)
    {
        require(_exists(_parentId));
        require(_childIndex < numberOfChildren(_parentId));
        OwnedNFT storage child = _ownedTokens[_parentId][_childIndex];
        return (child.tokenAddress, child.tokenId);
    }

    function safeTransferChild(
        address _tokenAddress,
        uint256 _tokenId,
        address _to,
        bytes memory _data
    ) public override {
        (bool isComposed, uint256 parentId, ) = parentToken(
            _tokenAddress,
            _tokenId
        );
        require(_isApprovedOrOwner(msg.sender, parentId));
        require(isComposed);
        ERC721(_tokenAddress).safeTransferFrom(
            address(this),
            _to,
            _tokenId,
            _data
        );
        _removeChild(_tokenAddress, _tokenId, parentId);
        _tokenIsComposed[msg.sender][_tokenId] = false;
    }

    function safeTransferChild(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _toTokenId
    ) public override {
        (bool isComposed, uint256 parentId, ) = parentToken(
            _tokenAddress,
            _tokenId
        );
        require(_isApprovedOrOwner(msg.sender, parentId));
        require(
            _isApprovedOrOwner(msg.sender, _toTokenId) ||
                senderIsEnabled(ownerOf(parentId), msg.sender),
            "Message sender is not approved"
        );
        require(isComposed);
        _removeChild(_tokenAddress, _tokenId, parentId);
        _receiveChild(_tokenAddress, _tokenId, _toTokenId);
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes memory _data
    ) public virtual override returns (bytes4) {
        require(msg.sender != address(this));
        uint256 parentId;
        assembly {
            parentId := calldataload(164)
        }
        if (_data.length < 32) {
            parentId = parentId >> (256 - _data.length * 8);
        }
        address composableOwner = ownerOf(parentId);
        require(
            _isApprovedOrOwner(_from, parentId) ||
                senderIsEnabled(composableOwner, _from) ||
                allSendersEnabled(composableOwner)
        );
        _receiveChild(msg.sender, _tokenId, parentId);
        _tokenIsComposed[msg.sender][_tokenId] = true;
        return ERC721_RECEIVED;
    }

    function _removeChild(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _parentId
    ) internal {
        uint256 tokenIndex = _ownedTokenIndex[_tokenAddress][_tokenId];
        uint256 lastElementIndex = _ownedTokens[_parentId].length - 1;
        if (
            _ownedTokens[_parentId].length > 1 && tokenIndex != lastElementIndex
        ) {

                OwnedNFT storage lastElement
             = _ownedTokens[_parentId][lastElementIndex];
            _ownedTokens[_parentId][tokenIndex] = _ownedTokens[_parentId][lastElementIndex];
            _ownedTokenIndex[lastElement.tokenAddress][lastElement
                .tokenId] = tokenIndex;
        }
        _ownedTokenIndex[_tokenAddress][_tokenId] = 0;
        _tokenParent[_tokenAddress][_tokenId] = 0;
        _ownedTokens[_parentId].pop();
    }

    function _receiveChild(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _parentId
    ) internal {
        _ownedTokens[_parentId].push(OwnedNFT(_tokenId, _tokenAddress));
        _ownedTokenIndex[_tokenAddress][_tokenId] =
            _ownedTokens[_parentId].length -
            1;
        _tokenParent[_tokenAddress][_tokenId] = _parentId;
    }

    function _decompose(
        uint256 _parentId,
        address _to,
        bytes memory _data
    ) internal {
        require(_exists(_parentId));
        for (uint256 i = 0; i < _ownedTokens[_parentId].length; i++) {
            OwnedNFT storage ownedToken = _ownedTokens[_parentId][i];
            ERC721(ownedToken.tokenAddress).safeTransferFrom(
                address(this),
                _to,
                ownedToken.tokenId,
                _data
            );
            _tokenParent[ownedToken.tokenAddress][ownedToken.tokenId] = 0;
            _ownedTokenIndex[ownedToken.tokenAddress][ownedToken.tokenId] = 0;
        }
        delete _ownedTokens[_parentId];
    }
}
