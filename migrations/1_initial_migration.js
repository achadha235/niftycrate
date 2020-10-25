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

  const ownedKittyIds3 = [
    1965182,
    1937977,
    1936891,
    1931950,
    1944744,
    1937122,
    1919652,
    9234,
  ];

  const ownedKittyIds2 = [1589858, 1376919, 471796, 292427];

  await Crate.setFees(mintingPrice, openPrice);

  if (network === 'development') {
    const TestToken = await deployer.deploy(TestNFT, 'Test', 'TST');

    await Crate.setTokenIsEnabled(TestToken.address, true);

    await TestToken.mint(ownedKittyIds);
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
      true
    );

    await Crate.mint(accounts[3], { value: web3.utils.toWei('1', 'ether') });
    await Crate.mint(accounts[4], { value: web3.utils.toWei('1', 'ether') });
    await Crate.mint(accounts[3], { value: web3.utils.toWei('1', 'ether') });

    await TestToken.mint(ownedKittyIds3, { from: accounts[1] });
    await Crate.mint(accounts[1], {
      value: web3.utils.toWei('1', 'ether'),
      from: accounts[1],
    });
    for (let i = 0; i < ownedKittyIds3.length; i++) {
      await TestToken.methods[
        'safeTransferFrom(address,address,uint256,bytes)'
      ](
        accounts[1],
        NiftyCrate.address,
        ownedKittyIds3[i],
        leftPadHexInteger(5),
        { from: accounts[1] }
      );
    }
    await Crate.configure(
      5,
      web3.utils.toWei('0.25', 'ether'),
      true,
      web3.utils.toWei('1', 'ether'),
      true,
      { from: accounts[1] }
    );

    await Crate.mint(accounts[3], { value: web3.utils.toWei('1', 'ether') });

    await Crate.mint(accounts[3], { value: web3.utils.toWei('1', 'ether') });
  }
  deployer.deploy(Migrations);
};
