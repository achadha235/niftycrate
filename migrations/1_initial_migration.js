const NiftyCrate = artifacts.require("NiftyCrate");
const ERC721Factory = artifacts.require("ERC721Factory");
const Migrations = artifacts.require("Migrations");
const NiftyCrateOpener = artifacts.require("NiftyCrateOpener");

module.exports = async function(deployer, network, accounts ) {
  deployer.deploy(ERC721Factory);
  await deployer.deploy(
    NiftyCrate, accounts[0], "Crate", "CRT",
    // { gas: 0x201c061 }
  );
  await deployer.deploy(NiftyCrateOpener, NiftyCrate.address);
  deployer.deploy(Migrations);
};
