# 📦📦📦 NiftyCrates - ETHGLOBAL2020 📦📦📦

## For NFT Whales: Turn your NFTs into a profitable lootbox.

**Problem:** You have lots of common NFTs that are hard to sell and only a few that are very valuable. You want to liquidate your tokens for as much ETH as possible.

**Solution:** Create an NFT lootbox to combine multiple tokens and use the randomised nature of loot boxes to encourage multiple purchases.

**Buying and setting up a NiftyCrate**

1. Buy a NiftyCrate from niftycrates.com
2. Put some NFTs into the NiftyCrate
3. Set the NiftyRanking™ for each of the tokens to set the drawing odds
4. Configure the price to open the NiftyCrate
5. Sit back and profit

## For NFT Players: Open fun lootboxes, win great NFTs

**Opening a NiftyCrate**

1. Buy gems from Nifty Crate
2. Pick a NiftyCrate that looks like it has something you want
3. Pay the opening fee cost use a gem to draw an item from the NiftyCrate

## Rinkeby Deployment

```
> NODE_ENV=development truffle migrate development


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'development-fork'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Deploying 'ERC721Factory'
   -------------------------

Error:  *** Deployment Failed ***

"ERC721Factory" could not deploy due to insufficient funds
   * Account:  0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   * Balance:  0 wei
   * Message:  sender doesn't have enough funds to send tx. The upfront cost is: 6982360000000000 and the sender's account only has: 0
   * Try:
      + Using an adequately funded account
      + If you are using a local Geth node, verify that your node is synced.

    at /Users/abhishekchadha/Desktop/niftycrates/node_modules/truffle/build/webpack:/packages/deployer/src/deployment.js:364:1
    at process._tickCallback (internal/process/next_tick.js:68:7)
Truffle v5.1.47 (core: 5.1.47)
Node v10.17.0
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! crate-contrats@1.0.0 deploy:contracts: `NODE_ENV=development truffle migrate development`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the crate-contrats@1.0.0 deploy:contracts script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/abhishekchadha/.npm/_logs/2020-10-11T10_42_54_024Z-debug.log
The terminal process "/usr/local/bin/zsh '-c', 'npm run deploy:contracts'" terminated with exit code: 1.

Terminal will be reused by tasks, press any key to close it.

> Executing task: npm run deploy:contracts <


> crate-contrats@1.0.0 deploy:contracts /Users/abhishekchadha/Desktop/niftycrates
> NODE_ENV=development truffle migrate development


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'development-fork'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Deploying 'ERC721Factory'
   -------------------------
   > block number:        7350426
   > block timestamp:     1602413110
   > account:             0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   > balance:             9.994414112
   > gas used:            2792944 (0x2a9df0)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.005585888 ETH


   Deploying 'NiftyCrate'
   ----------------------
   > block number:        7350427
   > block timestamp:     1602413226
   > account:             0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   > balance:             9.983860384
   > gas used:            5276864 (0x5084c0)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.010553728 ETH


   Deploying 'NiftyCrateOpener'
   ----------------------------
   > block number:        7350428
   > block timestamp:     1602413278
   > account:             0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   > balance:             9.98283689
   > gas used:            511747 (0x7cf03)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.001023494 ETH

   -------------------------------------
   > Total cost:          0.01716311 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.01716311 ETH





Starting migrations...
======================
> Network name:    'development'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Deploying 'ERC721Factory'
   -------------------------
   > transaction hash:    0x94786b79ad561a6df2c41975e1214e1ce54dc39755b61798dfc69bbee22c2e1e
   > Blocks: 2            Seconds: 17
   > contract address:    0x54Dbac9db6d32c3634578A06EC16525753A27380
   > block number:        7350440
   > block timestamp:     1602413311
   > account:             0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   > balance:             9.94414112
   > gas used:            2792944 (0x2a9df0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05585888 ETH


   Deploying 'NiftyCrate'
   ----------------------
   > transaction hash:    0xc00ca966911d7c832f3ff0712d50787808c37a2aa4c114cea1dd0fb28fd673f8
   > Blocks: 1            Seconds: 18
   > contract address:    0x6859Ae5FBF28B20b1b902603cc64461507902409
   > block number:        7350442
   > block timestamp:     1602413341
   > account:             0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   > balance:             9.83660472
   > gas used:            5376820 (0x520b34)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.1075364 ETH


   Deploying 'NiftyCrateOpener'
   ----------------------------
   > transaction hash:    0xe7d5421347f16325e775d684d69438ae0ca9410dccd4f2aa107436cf25be090d
   > Blocks: 1            Seconds: 17
   > contract address:    0xE26A61047649127e9855c4dC2b8E2Fc5920C111C
   > block number:        7350444
   > block timestamp:     1602413371
   > account:             0xD8C30f316F9A0C92e5A79Db86feCED91c2348F06
   > balance:             9.82606978
   > gas used:            526747 (0x8099b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01053494 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.17393022 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.17393022 ETH
```
