import "@typechain/hardhat"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "hardhat-deploy"
import "solidity-coverage"
import "@nomiclabs/hardhat-waffle"
import "@nomicfoundation/hardhat-toolbox"
import { HardhatUserConfig } from "hardhat/config"

// import "@nomiclabs/"
// import "hardhat-gas-reporter"
// import "solidity-coverage"

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

console.log(PRIVATE_KEY)

const config: HardhatUserConfig = {
    // solidity: "0.8.17",
    solidity: {
        compilers: [
            { version: "0.8.8" },
            { version: "0.6.6" },
            { version: "0.8.17" },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        users: {
            default: 1,
        },
    },
}

export default config
