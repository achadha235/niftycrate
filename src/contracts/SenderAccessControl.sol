// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract SenderAccessControl is ERC721 {
    // owner => senders => senderEnabled
    mapping(address => mapping(address => bool)) private _senderIsEnabled;

    // owner => senders => allSendersEnabled
    mapping(address => bool) private _allSendersEnabled;

    function senderIsEnabled(address _ownerAddress, address _sender)
        public
        view
        returns (bool)
    {
        return
            _allSendersEnabled[_ownerAddress] ||
            _senderIsEnabled[_ownerAddress][_sender];
    }

    function allSendersEnabled(address _ownerAddress)
        public
        view
        returns (bool)
    {
        return _allSendersEnabled[_ownerAddress];
    }

    function setSenderEnabled(address _tokenSender, bool _enabled) public {
        _senderIsEnabled[msg.sender][_tokenSender] = _enabled;
    }

    function setAllSendersEnabled(bool _enabled) public {
        _allSendersEnabled[msg.sender] = _enabled;
    }
}
