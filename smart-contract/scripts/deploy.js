const hre = require("hardhat");

async function main() {
  const CarSales = await hre.ethers.getContractFactory("CarSales");
  const contract = await CarSales.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});