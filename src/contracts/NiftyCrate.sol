// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

import "./interfaces/ISenderAccessControl.sol";
import "./TopDownComposable.sol";
import "./NiftyRanking.sol";
import "./NiftyCrateOpener.sol";

contract NiftyCrate is
    TopDownComposable,
    NiftyRanking,
    Ownable,
    ISenderAccessControl
{
    mapping(address => bool) private _tokenIsEnabled; // Mapping to track which NFTs can be composed
    address public crateOpener; // Link to the default crate opener contract

    uint256 public mintingFee; // The fee required to create a new crate
    uint256 public openFee; // The fee paid to open a crate

    mapping(uint256 => bool) public canOpen; // Whether a crate can be opened
    mapping(uint256 => uint256) public openCost; // The cost to open this crate
    mapping(uint256 => bool) public canBuy; // Whether the contents of the crate are for sale
    mapping(uint256 => uint256) public cost; // The cost to buy all the tokens from this crate
    mapping(uint256 => address) public customCrateOpener; // Mappings for the custom crate opener address

    /** Record keeping / leaderboards */

    // The number of times a given address has opened crates
    mapping(address => uint256) public numberOfTimesOpened;
    // The number of times a given address has successfully opened crate to recieve an item
    mapping(address => uint256) public tokensWon;

    constructor(
        address _owner,
        string memory _name,
        string memory _symbol
    ) public TopDownComposable(_name, _symbol) {
        require(_owner != address(0));
        if (msg.sender != _owner) {
            transferOwnership(_owner);
        }
    }

    function mint(address _to) public payable returns (uint256) {
        require(msg.value == mintingFee);
        // Since we do not burn tokens, we can mint the next token ID
        uint256 newTokenId = totalSupply();
        _mint(_to, newTokenId);
    }

    function setCrateOpener(address _crateOpener) public onlyOwner {
        crateOpener = _crateOpener;
    }

    // crateId, sender,openerAddr, tokenAddr, tokenIdGranted
    event CrateOpened(uint256, address, address, address, uint256);

    function open(uint256 _tokenId, uint256 _data)
        public
        payable
        returns (address, uint256)
    {
        // The composable token must exist and be openable.
        require(_exists(_tokenId));
        require(canOpen[_tokenId] == true);
        // The correct price must be paid by the opener and the token must have children
        require(
            openCost[_tokenId] == 0 || msg.value == openCost[_tokenId] + openFee
        );
        require(numberOfChildren(_tokenId) > 0);

        // We set the crate opener address. If it is 0 we abort.
        address crateOpenerAddr = customCrateOpener[_tokenId];
        if (crateOpenerAddr == address(0)) {
            crateOpenerAddr = crateOpener;
        }
        require(crateOpenerAddr != address(0));

        // Invoke the crate opener and grant the token returned
        NiftyCrateOpener opener = NiftyCrateOpener(crateOpenerAddr);
        (bool tokenGranted, address tokenAddress, uint256 tokenId) = opener
            .open(msg.sender, _tokenId, _data);
        if (tokenGranted) {
            (, uint256 parentId, ) = parentToken(tokenAddress, tokenId);
            require(_tokenId == parentId);
            ERC721(tokenAddress).safeTransferFrom(
                address(this),
                msg.sender,
                tokenId
            );
            _removeChild(tokenAddress, tokenId, _tokenId);
        }

        emit CrateOpened(
            _tokenId,
            msg.sender,
            crateOpenerAddr,
            tokenAddress,
            tokenId
        );

        // Update the leaderboard bookeeping values only if the default crateOpener is used
        if (tokenGranted && crateOpenerAddr == crateOpener) {
            tokensWon[msg.sender]++;
        }

        if (crateOpenerAddr == crateOpener) {
            numberOfTimesOpened[msg.sender]++;
        }
    }

    function buy(uint256 _tokenId) public payable {
        require(canBuy[_tokenId] == true);
        require(msg.value == cost[_tokenId]);
        _decompose(_tokenId, msg.sender, "");
    }

    event CrateConfigured(uint256, uint256, bool, uint256, bool);

    function configure(
        uint256 _tokenId,
        uint256 _openPrice,
        bool _canOpen,
        uint256 _buyPrice,
        bool _canBuy
    ) public {
        require(_isApprovedOrOwner(msg.sender, _tokenId));
        canBuy[_tokenId] = _canBuy;
        canOpen[_tokenId] = _canOpen;
        openCost[_tokenId] = _openPrice;
        cost[_tokenId] = _buyPrice;
        emit CrateConfigured(
            _tokenId,
            _openPrice,
            _canOpen,
            _buyPrice,
            _canBuy
        );
    }

    function safeTransferAllChildren(
        uint256 _tokenId,
        address _to,
        bytes memory _data
    ) public {
        require(
            _isApprovedOrOwner(msg.sender, _tokenId),
            "Not approved or owner"
        );
        _decompose(_tokenId, _to, _data);
    }

    function setFees(uint256 _mintingFee, uint256 _openFee) public onlyOwner {
        mintingFee = _mintingFee;
        openFee = _openFee;
    }

    function setTokenIsEnabled(address _tokenAddress, bool _enabled)
        public
        override
        onlyOwner
    {
        _tokenIsEnabled[_tokenAddress] = _enabled;
    }

    function setTokenRanking(
        address _tokenAddress,
        uint256 _tokenId,
        uint32 _rank
    ) public override {
        (bool isComposed, uint256 parentId, ) = parentToken(
            _tokenAddress,
            _tokenId
        );

        // We prevent people from changing the ranking if the crate is open
        if (isComposed) {
            require(
                canOpen[parentId] == false &&
                    _isApprovedOrOwner(msg.sender, parentId)
            );
        } else {
            address tokenOwner = ERC721(_tokenAddress).ownerOf(_tokenId);
            require(
                tokenOwner == msg.sender ||
                    ERC721(_tokenAddress).getApproved(_tokenId) == msg.sender ||
                    ERC721(_tokenAddress).isApprovedForAll(
                        msg.sender,
                        tokenOwner
                    )
            );
        }
        return super.setTokenRanking(_tokenAddress, _tokenId, _rank);
    }

    function tokenIsEnabled(address _tokenAddress)
        public
        override
        view
        returns (bool)
    {
        return _tokenIsEnabled[_tokenAddress];
    }

    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes memory _data
    ) public override returns (bytes4) {
        require(_tokenIsEnabled[msg.sender], "Token must be enabled");
        return super.onERC721Received(_operator, _from, _tokenId, _data);
    }
}
