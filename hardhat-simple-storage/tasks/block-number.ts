import { task } from "hardhat/config"

export default task(
    "block-number",
    "Prints the current block of number"
).setAction(async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Current blick number ${blockNumber}`)
})
