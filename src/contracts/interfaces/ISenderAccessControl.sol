// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

abstract contract ISenderAccessControl {
    function setTokenIsEnabled(address _tokenAddress, bool _enabled)
        public
        virtual;

    function tokenIsEnabled(address _tokenAddress)
        public
        virtual
        view
        returns (bool);
}
