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
  console.log('Opener set', NiftyCrateOpener.address);

  let mintingPrice = web3.utils.toWei('1', 'ether');
  let openPrice = web3.utils.toWei('0.0013', 'ether'); // About 50 cents

  await Crate.setFees(mintingPrice, openPrice);

  if (network === 'development') {
    const TestToken = await deployer.deploy(TestNFT, 'Test', 'TST');
    await TestToken.mint([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await Crate.setTokenIsEnabled(TestToken.address, true);
    await Crate.mint(accounts[0], { value: web3.utils.toWei('1', 'ether') });
    for (let i = 1; i <= 10; i++) {
      await TestToken.safeTransferFrom(
        accounts[0],
        NiftyCrate.address,
        i,
        leftPadHexInteger(0)
      );
      console.log('Transferred ', i);
    }
  }
  deployer.deploy(Migrations);
};
