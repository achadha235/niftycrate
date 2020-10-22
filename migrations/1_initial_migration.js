const NiftyCrate = artifacts.require('NiftyCrate');
const ERC721Factory = artifacts.require('ERC721Factory');
const Migrations = artifacts.require('Migrations');
const NiftyCrateOpener = artifacts.require('NiftyCrateOpener');
const TestNFT = artifacts.require('TestNFT');

const leftPadHexInteger = (n) => web3.utils.padLeft(web3.utils.toHex(n), 32);

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(NiftyCrate, accounts[0], 'Crate', 'CRT');
  await deployer.deploy(NiftyCrateOpener, NiftyCrate.address);

  const Crate = await NiftyCrate.deployed();
  await Crate.setCrateOpener(NiftyCrateOpener.address);

  let mintingPrice = web3.utils.toWei('1', 'ether');
  let openPrice = web3.utils.toWei('0.0013', 'ether'); // About 50 cents
  const ownedKittyIds = [
    1580577,

    1329392,
    1010773,
    884485,
    507451,

    261294,
    203216,
    120,
  ];

  const ownedKittyIds2 = [1589858, 1376919, 471796, 292427];

  await Crate.setFees(mintingPrice, openPrice);

  if (network === 'development') {
    const TestToken = await deployer.deploy(TestNFT, 'Test', 'TST');
    await TestToken.mint(ownedKittyIds);
    await Crate.setTokenIsEnabled(TestToken.address, true);
    await Crate.mint(accounts[0], { value: web3.utils.toWei('1', 'ether') });
    for (let i = 0; i < ownedKittyIds.length; i++) {
      await TestToken.safeTransferFrom(
        accounts[0],
        NiftyCrate.address,
        ownedKittyIds[i],
        leftPadHexInteger(0)
      );
    }
    await Crate.configure(
      0,
      web3.utils.toWei('0.8', 'ether'),
      true,
      web3.utils.toWei('2.5', 'ether'),
      true
    );

    await TestToken.mint(ownedKittyIds2);
    await Crate.mint(accounts[0], { value: web3.utils.toWei('1', 'ether') });
    for (let i = 0; i < ownedKittyIds2.length; i++) {
      await TestToken.safeTransferFrom(
        accounts[0],
        NiftyCrate.address,
        ownedKittyIds2[i],
        leftPadHexInteger(1)
      );
    }
    await Crate.configure(
      1,
      web3.utils.toWei('0.3', 'ether'),
      true,
      web3.utils.toWei('2.9', 'ether'),
      false
    );
  }
  deployer.deploy(Migrations);
};
