import { ethers, getNamedAccounts } from "hardhat"
import { FundMe } from "../typechain-types"

const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundMe: FundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Contracts...")

    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    })

    await transactionResponse.wait(1)
    console.log("Funded")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
