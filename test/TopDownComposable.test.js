const NiftyCrate = artifacts.require("./NiftyCrate.sol");
const ERC721Factory = artifacts.require("./ERC721Factory.sol");
const TestNFT = artifacts.require("./TestNFT.sol");
const utils = require('./utils');

const { leftPadHexInteger } = utils;

let niftyCrate, nftFactory;
contract("TopDownComposable.sol", function(accounts) {
    let [owner, alice, bob, carol] = accounts;
    let maxGasLimit = 6000000;
    let aliceComposables = [];
    let aliceTokens = [];
    let nft;
    before(async () => {
        niftyCrate = await NiftyCrate.deployed();
        nftFactory = await ERC721Factory.deployed();
    });

    it("Should be able to deploy an NFT contract and mint a token", async function() {
        const deployTx = await nftFactory.deployToken("CryptoKitties", "CK", {
            from: accounts[0]
        });
        const newTokenAddress = deployTx.logs[0].args.tokenAddress;
        nft = await TestNFT.at(newTokenAddress);
        await nft.methods['mint(uint256)']( 100 , {
            from: accounts[1],
            gas: maxGasLimit
        });
        aliceTokens.push(100);
    });

    it("Should be able to batch mint NFT tokens", async function() {
        const newComposables = [ 101, 102, 103, 104, 105 ];
        await nft.methods['mint(uint256[])'](newComposables, {
            from: accounts[1],
            gas: maxGasLimit
        });
        aliceTokens.push(...newComposables);
    });


    it("Owner can set the crate fees", async function() {
        await niftyCrate.setFees(1000, 1000, { from: owner });
    });

    it("Owner can add an NFT address", async function() {
        await niftyCrate.setTokenIsEnabled(nft.address, true, { from: owner });
    });

    it("Alice can a create a new crate", async function() {
        let mintTx = await niftyCrate.mint(alice, { from: alice, value: 1000 });
        const mintedTokenId = mintTx.logs[0].args.tokenId.toNumber();
        aliceComposables.push(mintedTokenId);
    });

    it("Alice can transfer her token into a crate she owns", async function() {
        const safeTransferMethod = nft.methods['safeTransferFrom(address,address,uint256,bytes)'];
        await safeTransferMethod(alice, niftyCrate.address, 100, leftPadHexInteger(aliceComposables[0]), { from: alice });
    });

    it("Alice can configure her crate", async function() {
        await niftyCrate.configure(aliceComposables[0], 1000, true, 2000, true, { from: alice });
    });

    it("Alice can enable Bob to send tokens to her composables", async function () {
        await niftyCrate.setSenderEnabled(bob, true, { from: alice });
    });
    it("Alice can enable all senders", async function () {
        await niftyCrate.setAllSendersEnabled(true, { from: alice });
    });
});