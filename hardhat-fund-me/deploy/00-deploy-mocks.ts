import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
    DECIMALS,
    developmentChain,
    INITIAL_ANSWER,
} from "../helper-hardhat-config"

const deployMocks: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChain.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        console.log("Mocks deployed!")
        console.log("---------------------------")
    }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]
