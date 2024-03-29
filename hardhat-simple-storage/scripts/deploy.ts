import { ethers, run, network } from "hardhat"

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contact ...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()

    console.log(`Deployed contact to ${simpleStorage.address}`)

    console.log(network.config)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrive()
    console.log(`Current value ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updateValue = await simpleStorage.retrive()
    console.log(`Updated Value is ${updateValue}`)
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
