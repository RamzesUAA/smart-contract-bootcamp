// import
// main function
// calling of main function
// const deployFunc = () => {
//     console.log("HI")
// }

import verify from "../utils/verify"
import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChain, networkConfig } from "../helper-hardhat-config"
// export default deployFunc

const deployFundMe = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network?.config?.chainId || 1

    let ethUsdPriceFeedAddress
    if (developmentChain.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        // waitConfirmations: 6,
    })

    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("VERIFYINGGGGGGGG")
        await verify(fundMe.address, args)
    }
    log("---------------------------")
}

export default deployFundMe
deployFundMe.tags = ["all", "fundme"]
