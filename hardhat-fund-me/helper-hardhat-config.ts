const networkConfig: NetworkCnofig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}

const developmentChain = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 2000000000000

type NetworkType = {
    name: string
    ethUsdPriceFeed: string
}
type NetworkCnofig = { [key: number]: NetworkType }

export { networkConfig, developmentChain, DECIMALS, INITIAL_ANSWER }
