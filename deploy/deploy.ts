import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedPayParity = await deploy("PayParity", {
    from: deployer,
    log: true,
  });

  console.log(`PayParity contract: `, deployedPayParity.address);
};
export default func;
func.id = "deploy_payParity"; // id required to prevent reexecution
func.tags = ["PayParity"];