const NiftyCrate = artifacts.require("./NiftyCrate.sol");
const ERC721Factory = artifacts.require("./ERC721Factory.sol");
const TestNFT = artifacts.require("./TestNFT.sol");
const NiftyCrateOpener = artifacts.require("./NiftyCrateOpener.sol");
const utils = require('./utils');

const [alice, bob, carol, dave, erin ] = utils.names;

contract("NiftyCrate.sol", function(accounts) {

    let setup;
    let aliceKitties = Array(5).fill(0).map((_, i) => ({ id: i + 1}));

    let aliceOpenFee = web3.utils.toWei('0.1', 'ether');
    let aliceBuyFee = web3.utils.toWei('3', 'ether');

    let totalOpenCost;
    let crateOpener;

    let initialConfig = {
        tokens: { CryptoKitties: 'CK' },
        crateSettings: {
            paused: false,
            mintingFee: 1000,
            openFee: 1000,
            enabledTokens: { CryptoKitties: true }
        },
        users: {
            bob: {},
            alice: {
                composableApproveAll: bob,
                composables: [
                    {
                        children: {
                            CryptoKitties: aliceKitties.map(({ id }) => id)
                        }
                    }
                ],
                nfts: {
                    CryptoKitties: {
                        tokens: aliceKitties
                    }
                }
            }
        }
    }

    before(async () => {
        setup = await utils.setupTokens(accounts, NiftyCrate, TestNFT, ERC721Factory, initialConfig);
        crateOpener = await NiftyCrateOpener.deployed();
        await setup.niftyCrate.setCrateOpener(crateOpener.address);

        const { users } =  setup;
        const transferGasCost = 21000;
        for (let i = 3; i < accounts.length; i++) {
            const balanceOfUser = await web3.eth.getBalance(accounts[i]);
            const transferAmount = BigInt(balanceOfUser) - BigInt(transferGasCost);
            await web3.eth.sendTransaction({
                from: accounts[i],
                to: users.bob.address,
                value: transferAmount.toString(10),
                gas: transferGasCost,
                gasPrice: 1,
            });
        }
    });


    it("Alice should have 100 tokens in her crate", async function() {
        const { tokens, users, niftyCrate } =  setup;
        const aliceComposableBalance = await niftyCrate.numberOfChildren(users.alice.composables[0].tokenId);
        assert.equal(aliceComposableBalance.toNumber(), aliceKitties.length, "Unexpected number of tokens in the composable");
    });


    it("Alice should have 100 tokens in her crate", async function() {
        const { tokens, users, niftyCrate } =  setup;
        const aliceComposableBalance = await niftyCrate.numberOfChildren(users.alice.composables[0].tokenId);
        assert.equal(aliceComposableBalance.toNumber(), aliceKitties.length, "Unexpected number of tokens in the composable");
    });

    it("Alice should be able to configure her crate", async function() {
        const { tokens, users, niftyCrate } =  setup;
        const aliceComposableId = users.alice.composables[0].tokenId;
        await niftyCrate.configure(
            aliceComposableId,
            aliceOpenFee,
            true,
            aliceBuyFee,
            true,
            { from: users.alice.address }
        );
        const openFeeSet = await niftyCrate.openCost(aliceComposableId);
        const canOpenSet = await niftyCrate.canOpen(aliceComposableId);
        const buyFeeSet = await niftyCrate.cost(aliceComposableId);
        const canBuySet = await niftyCrate.canBuy(aliceComposableId);

        assert(canBuySet, "Expected canBuy to be true");
        assert(canOpenSet, "Expected canOpen to be true");
        assert.equal(openFeeSet.toString(), aliceOpenFee, "Mismatched open cost");
        assert.equal(buyFeeSet.toString(), aliceBuyFee, "Mismatched buy cost");
    });

    it("Bob should not be able to open the crate without paying the opening fee and cost", async function() {
        const { tokens, users, niftyCrate } =  setup;
        const aliceComposableId = users.alice.composables[0].tokenId;
        let numErrors = 0;
        try {
            await niftyCrate.open(
                aliceComposableId,
                8329048329,
                { from: users.bob.address }
            );
        } catch (err) {
            numErrors++;
        }
        assert.equal(numErrors, 1, "Expected exactly one error");
        
        const openFeeSet = await niftyCrate.openCost(aliceComposableId);
        const canOpenSet = await niftyCrate.canOpen(aliceComposableId);
        const buyFeeSet = await niftyCrate.cost(aliceComposableId);
        const canBuySet = await niftyCrate.canBuy(aliceComposableId);

        assert(canBuySet, "Expected canBuy to be true");
        assert(canOpenSet, "Expected canOpen to be true");
        assert.equal(openFeeSet.toString(), aliceOpenFee, "Mismatched open cost");
        assert.equal(buyFeeSet.toString(), aliceBuyFee, "Mismatched buy cost");
    });

    let allTokenDraws = [];
    let drawnTokenIds = [];

    it("Bob should be able to fetch the open fee and open a crate", async function() {
        const { tokens, users, niftyCrate } =  setup;

        await crateOpener.generateNonces(100, { from: users.bob.address})

        
        const aliceComposableId = users.alice.composables[0].tokenId;
        const openFee = await niftyCrate.openFee();
        const openCost = await niftyCrate.openCost(aliceComposableId);
        const canOpen = await niftyCrate.canOpen(aliceComposableId);

        totalOpenCost = openFee.add(openCost);

        assert(canOpen, "Expected the crate to be openable");
        const openTransaction = await niftyCrate.open(
            aliceComposableId,
            9842038,
            { from: users.bob.address, value: totalOpenCost }
        );
        const transferLog = openTransaction.logs[1];
        assert.equal(transferLog.address, tokens.CryptoKitties.address, "Expected a CK type token from the crate");
        const drawnTokenId = transferLog.args.tokenId.toNumber();
        assert(drawnTokenId, 1 <= drawnTokenId && drawnTokenId<= aliceKitties.length, "Expected a token Id between 1 and 100");
        const sentToAddress = transferLog.args.to;
        assert.equal(sentToAddress, users.bob.address, "The token should have been sent to Bob");
        drawnTokenIds.push(drawnTokenId);
    });

    it("Bob should be able to draw from the crate until it is empty", async function() {
        const { tokens, users, niftyCrate } =  setup;
        const aliceComposableId = users.alice.composables[0].tokenId;
        for (var i = 0; i < 100; i++)  {
            await crateOpener.generateNonces(100, { from: users.bob.address})
        }
        for (let i = 0; i < aliceKitties.length - 1; i++) {
            const openTransaction = await niftyCrate.open(
                aliceComposableId,
                42,
                { from: users.bob.address, value: totalOpenCost }
            );
            const transferLog = openTransaction.logs[1];
            assert.equal(transferLog.address, tokens.CryptoKitties.address, "Expected a CK type token from the crate");
            const drawnTokenId = transferLog.args.tokenId.toNumber();
            assert(drawnTokenId, 1 <= drawnTokenId && drawnTokenId<= aliceKitties.length, "Expected a token Id between 1 and 100");
            const sentToAddress = transferLog.args.to;
            assert.equal(sentToAddress, users.bob.address, "The token should have been sent to Bob");
            drawnTokenIds.push(drawnTokenId);
        }
        const bobsBalance = await tokens.CryptoKitties.balanceOf(users.bob.address)
        assert.equal(bobsBalance.toNumber(), aliceKitties.length, "Expected Bob to have 100 CK tokens");
        allTokenDraws.push(drawnTokenIds);
    });


    it("Bob should be able to send back all the tokens and draw over and over again", async function() {
        const { tokens, users, niftyCrate } =  setup;
        const aliceComposableId = users.alice.composables[0].tokenId;
        const numDraws = 30;    
        for (let i = 0; i < numDraws; i++) {     
            for (let j = 1; j <= aliceKitties.length; j++) {   
                await tokens.CryptoKitties.methods['safeTransferFrom(address,address,uint256,bytes)'](
                    users.bob.address, niftyCrate.address, j, utils.leftPadHexInteger(aliceComposableId),
                    { from: users.bob.address }
                );
            }

            let newDraw = [];
            for (let k = 0; k < aliceKitties.length; k++) {
                const openTransaction = await niftyCrate.open(
                    aliceComposableId,
                    42,
                    { from: users.bob.address, value: totalOpenCost }
                );
                const transferLog = openTransaction.logs[0];
                const drawnTokenId = transferLog.args.tokenId.toNumber();
                newDraw.push(drawnTokenId);
            }
            allTokenDraws.push(newDraw);
        }
    });

    it("Each of Bob's draws should have been equally likey", async function () {
        // Suppose each draw is a set of n random variables [X1, X2, X3, X4, X5] where Xi is the ith token in the draw
        // We want to observe that P(X1 = 1) == P(X1 == 2)... == P(X1 = n) each Xi 
        // We also want to see that P(X1 = 1) == P(X1 = 2) == P(X1 = 3) ... == P(X1 = n) for each Xi
        
        let numberEncounteredAtIndex = Array(aliceKitties.length + 1).fill(0).map(() => []);
        let indexOfNumbersEncounterd = Array(aliceKitties.length + 1).fill(0).map(() => []);

        for (let i = 0; i < allTokenDraws.length; i++) {
            let currentDraw = allTokenDraws[i];
            for (let j = 0; j < currentDraw.length; j++) {
                let currentDrawNumber = currentDraw[j];
                let currentDrawNumberIndex = j;

                if (numberEncounteredAtIndex[currentDrawNumber][currentDrawNumberIndex] === undefined) {
                    numberEncounteredAtIndex[currentDrawNumber][currentDrawNumberIndex] = 1;
                } else {
                    numberEncounteredAtIndex[currentDrawNumber][currentDrawNumberIndex] += 1;
                }

                if (indexOfNumbersEncounterd[currentDrawNumberIndex][currentDrawNumber] === undefined) {
                    indexOfNumbersEncounterd[currentDrawNumberIndex][currentDrawNumber] = 1;
                } else {
                    indexOfNumbersEncounterd[currentDrawNumberIndex][currentDrawNumber] += 1;
                }
            }
        }
        const expectedAverage = allTokenDraws.length / aliceKitties.length;
        const tolerance = 0.1;
        for (var i = 0; i < indexOfNumbersEncounterd.length - 1; i++) {
            const average = indexOfNumbersEncounterd[i].reduce((acc, x) => acc + x, 0) / aliceKitties.length;
            assert(Math.abs(expectedAverage - average) < tolerance, "The difference in expected value was not witin the tolerace range")
        }

        for (var i = 1; i < numberEncounteredAtIndex.length; i++) {
            const average = numberEncounteredAtIndex[i].reduce((acc, x) => acc + x, 0) / aliceKitties.length;
            assert(Math.abs(expectedAverage - average) < tolerance, "The difference in expected value was not witin the tolerace range")
        }
    })
});
