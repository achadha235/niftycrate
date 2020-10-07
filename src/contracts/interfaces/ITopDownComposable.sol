// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 TopDownComposables represent an ERC721 that is able to compose other ERC721s into itself.  Visual: An NFT which serves as a "box" for your other NFTs.

    Terminology: 

    Non fungible token (NFT or ERC721)
    A non-fungible token is a pair (address A, uint256 X) where address A is a contract that implements ERC721 and X is a token ID that exists on A. Used interchangable with ERC721 token.

    Approved address
    An address that is allowed to operate an NFT on behalf of its owner

    Composable / Composable token
    An NFT that can in some way attach to another NFT
    
    Top Down Composable (TDC)
    Any type of composable token where upon composing the TDC contract necessarily becomes the new owner of the NFT.
    
    Parent / ParentID
    Given a composed NFT, the parent is composable token that is it's owner.

    Child / Child NFT
    An NFT that is owned by a composable token is referred to as composable token's child.

    Sender address
    An address that is authorized to add tokens into a TDC.


 */

abstract contract ITopDownComposable is ERC721, IERC721Receiver {
    /**
    @notice Return the parent composable token and child index for an NFT
    @dev A parentId of 0 indicates this token is not composed.
    @param _tokenAddress The contract address for the NFT being queried
    @param _tokenId The token ID for the NFT being queried
    */
    function parentToken(address _tokenAddress, uint256 _tokenId)
        public
        virtual
        view
        returns (
            bool,
            uint256,
            uint256
        );

    /**
    @notice Return the number of children in a parent composable token
    @param _tokenId The token ID for the NFT being queried
    */
    function numberOfChildren(uint256 _tokenId)
        public
        virtual
        view
        returns (uint256);

    /**
    @notice Return the NFT contract address and ID of a given child
    @param _tokenId The token ID of the parent composable
    @param _childIndex The child index being accessed in the parent composable
    */
    function childAtIndex(uint256 _tokenId, uint256 _childIndex)
        public
        virtual
        view
        returns (address, uint256);

    /**
    @notice Transfer a child NFT. You must be the own or be approved to operate the crate.
    @param _tokenAddress The address of the NFT contract being transferred
    @param _tokenId The token ID of the parent composable
    @param _to The address you want to transfer the NFT to
    @param _data Any additonal data to be used in the safeTransfer ERC721 transaction during the transfer
    */
    function safeTransferChild(
        address _tokenAddress,
        uint256 _tokenId,
        address _to,
        bytes memory _data
    ) public virtual;

    /**
    @notice Transfer a child NFT between two composables. You must be the own or be approved to operate the crate.
    @param _tokenAddress The address of the NFT contract being transferred
    @param _tokenId The token ID of the parent composable
    @param _toTokenId The ID of the composable you're transfering to
    */
    function safeTransferChild(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _toTokenId
    ) public virtual;

    // /**
    // @notice Returns whether a sender is enabled for a given owner address
    // @param _ownerAddress The token owner being queried
    // @param _sender The sender being wishing to send a token
    // */
    // function senderIsEnabled(address _ownerAddress, address _sender)
    //     public
    //     virtual
    //     view
    //     returns (bool);

    // /**
    // @notice Returns whether all senders are enabled for a given owner address
    // @param _ownerAddress The token owner being queried
    // */
    // function allSendersEnabled(address _ownerAddress)
    //     public
    //     virtual
    //     view
    //     returns (bool);

    // /**
    // @notice Sets whether a sender is enabled or not for the caller
    // @param _tokenSender The token sender to enable or disable
    // @param _enabled Whether the _tokenSender is enabled.
    // */
    // function setSenderEnabled(address _tokenSender, bool _enabled)
    //     public
    //     virtual;

    // /**
    // @notice Sets whether all senders are enabled or not for the caller
    // @param _enabled Whether the allSendersEnabeld flag is enabled.
    // */
    // function setAllSendersEnabled(bool _enabled) public virtual;

    event ChildTransfered(
        address _from,
        uint256 _fromTokenId,
        address _toAddress,
        uint256 _toTokenId,
        bytes _data
    );

    event SendAllApprovalChanged(
        address _from,
        address _fromTokenId,
        address _toAddress,
        uint256 _toTokenId
    );

    event SenderApprovalChanged(
        address _from,
        address _fromTokenId,
        address _toAddress,
        uint256 _toTokenId
    );
}
