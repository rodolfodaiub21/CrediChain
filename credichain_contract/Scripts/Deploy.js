const hre = require("hardhat");

async function main() {
  const CreditScore = await hre.ethers.getContractFactory("CreditScore");
  const contract = await CreditScore.deploy();

  await contract.waitForDeployment();

  console.log("CreditScore deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});