const utils = {}



const alice = 'alice';
const bob = 'bob';
const carol = 'carol';
const dave = 'dave';
const erin = 'erin';

const names = [alice, bob, carol, dave, erin];
const leftPadHexInteger = (n) => web3.utils.padLeft(web3.utils.toHex(n), 32);
const config = {
    // Number of NFTs in the system
    numberOFNFTs: 3,

    users: {
        alice: {
            numberOfComposables: 1,
            nfts: [
                { 15: { approved: [ bob ] } },
                { 15: { approved: [ bob ] }, 16: { approved: [] } }
            ]
        }
    }    
}

let userNameAddresses;

async function setupTokens(
    accounts,
    NiftyCrateArtifacts,
    ERC721Artifacts,
    ERC721FactoryArtifacts, 
    { crateSettings, tokens, users }
){
    niftyCrate = await NiftyCrateArtifacts.deployed();
    nftFactory = await ERC721FactoryArtifacts.deployed();
    const owner = accounts[0];
    const userAddresses = names.reduce((acc, name, index) => {
        acc[name] = accounts[index + 1];
        return acc;
    }, {});

    function getUserAddress(username) {
        if (username.slice(0, 2) == '0x') {
            return username;
        } else if (userAddresses[username] !== undefined) {
            return userAddresses[username];
        }
    }


    // 1.2 Set up the composable fees
    let mintingFee = crateSettings.mintingFee || 1000;
    let openFee = crateSettings.openFee || 1000;
    if (crateSettings) {
        await niftyCrate.setFees(mintingFee, openFee , { from: owner });
    }

    // 1. Set up NFTs
    const deployedTokens = {};
    for (let tokenType in tokens) {
        const deployTokenTx = await nftFactory.deployToken(tokenType, tokens[tokenType]);
        const tokenCreatedEvent = deployTokenTx.logs[0];
        const { tokenAddress } = tokenCreatedEvent.args;
        const contract = await ERC721Artifacts.at(tokenAddress);
        // 1. Enable the token
        await niftyCrate.setTokenIsEnabled(contract.address, true, { from: owner });
        deployedTokens[tokenType] = contract;
    }


    // 2. Set up users
    for (let username in users) {
        let user = users[username];
        let userAddress = getUserAddress(username);
        users[username].address = userAddress;
        let deployedComposables = [];
        if (user.nfts) {
            // 2.1. Set up user's NFTs
            for (let tokenType in user.nfts) {
                if (!deployedTokens[tokenType]) {
                    throw new Error(`${tokenType}: No such token`);
                }
                const userTokens = user.nfts[tokenType].tokens;
                const approveAllUsername = user.nfts[tokenType].approved;
                const userTokenIds = userTokens.map((t) => t.id);
                const mintGasLimit = 6000000;
                if (userTokenIds.length > 0) {
                    for (let userTokenId of userTokenIds) {
                        await deployedTokens[tokenType].mint(
                            [userTokenId],
                            { from: userAddress, gas: mintGasLimit }
                        )
                    }
                }
                
                if (userTokens && userTokens.length && userTokens.length > 0) {
                    for (userToken in userTokens) {
                        if (userToken.approved && typeof userToken.approved === 'string') {
                            await deployedTokens[tokenType].approve(
                                getUserAddress(approvedUsername),
                                userToken.id,
                                { from: userAddress }
                            );
                        }
                    }
                }

                if (approveAllUsername && typeof approveAllUsername === 'string') {
                    await deployedTokens[tokenType].setApprovalForAll(
                        getUserAddress(approveAllUsername), true,
                        { from: userAddress }
                    );
                }
            }
        }

        // 2.3 Set up user's composables

        if (user.composables) {
            let composables;
            if (typeof user.composables === 'number') {
                composables = Array(user.composables).fill({});
            } else if (typeof user.composables === 'object') {
                composables = user.composables;
            }

            if (user.composableApproveAll) {
                await niftyCrate.setApprovalForAll(
                    getUserAddress(user.composableApproveAll), true, { from: userAddress }
                );
            }

            for (let composableConfig of composables) {
                // 2.2.1 Deploy the token. You don't get to pick the ID for this one.
                const deployComposableTx = await niftyCrate.mint(getUserAddress(username), {
                    from: getUserAddress(username),
                    value: mintingFee
                });
                const deployedComposableId = deployComposableTx.logs[0].args.tokenId;
                // 2.2.2 Set the approved people
                if (composableConfig.approved) {
                    await niftyCrate.approve(
                        deployedComposableId,
                        getUserAddress(composableConfig.approved), true, { from: userAddress }
                    );
                }

                // Set senders: Accounts that can compose with your tokens
                if (composableConfig.senders && composableConfig.senders.length) {
                    for (let senderUsername of composableConfig.senders) {
                        await niftyCrate.setSenderEnabled(getUserAddress(senderUsername), true, { from: userAddress });
                    }
                }

                if (composableConfig.allSendersEnabled && typeof composableConfig.allSendersEnabled === 'boolean') {
                    await niftyCrate.setAllSendersEnabled(composableConfig.allSendersEnabled, { from: userAddress });
                }


                if (composableConfig.children) {
                    for (let childNftType of Object.keys(composableConfig.children)) {
                        if (deployedTokens[childNftType] === undefined) {
                            throw new Error("Invalid token type")
                        }
                        for (childNftId of composableConfig.children[childNftType]) {
                            if (typeof childNftId !== 'number'){
                                throw new Error("Child NFT ID must be a number");
                            }
                            const safeTransferMethod = 'safeTransferFrom(address,address,uint256,bytes)'
                            const transferTx = await deployedTokens[childNftType].methods[safeTransferMethod](
                                userAddress,
                                niftyCrate.address,
                                childNftId, 
                                leftPadHexInteger(deployedComposableId.toNumber()),
                                { from: userAddress },
                            );
                        }
                    }
                }
                


                let canOpen = composableConfig.canOpen || false;
                let canBuy = composableConfig.canBuy || false;
                let buyPrice = composableConfig.buyPrice || 0;
                let openPrice = composableConfig.openPrice || 0;
                
                await niftyCrate.configure(deployedComposableId, openPrice, canOpen, buyPrice, canBuy, { from: userAddress });

                deployedComposables.push({
                    ...composableConfig,
                    tokenId: deployedComposableId.toNumber(),
                });
            }
            user.composables = deployedComposables
        }
    }
    //Pause the crate contract if necessary.
    if (crateSettings && crateSettings.paused) {
        niftyCrate.pause({ from: owner });
    } 
    return { crateSettings, tokens: deployedTokens, users, niftyCrate, nftFactory };
}


module.exports = {
    leftPadHexInteger,
    setupTokens,
    names: [alice, bob, carol, dave, erin]
};
