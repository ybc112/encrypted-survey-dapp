const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy EncryptedSurveySimplified
  console.log("Deploying EncryptedSurveySimplified...");
  const EncryptedSurvey = await hre.ethers.getContractFactory("EncryptedSurveySimplified");
  const encryptedSurvey = await EncryptedSurvey.deploy();

  await encryptedSurvey.waitForDeployment();
  const address = await encryptedSurvey.getAddress();

  console.log("✅ EncryptedSurveySimplified deployed to:", address);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);

  // Wait for confirmations on testnets
  if (hre.network.name === "sepolia") {
    console.log("\n⏳ Waiting for 5 block confirmations...");
    await encryptedSurvey.deploymentTransaction().wait(5);
    console.log("✅ Confirmed!");

    console.log("\n📝 Verify contract with:");
    console.log(`npx hardhat verify --network sepolia ${address}`);
  }

  console.log("\n✅ Deployment complete!");
  console.log("Contract address:", address);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
