### Yarn hardhads commands:

- `yarn hardhat compile` // compiles scipts
- `yarn hardhat console --network localhost` // Opens hardhat env in bash, so we can deploy and interact with contracts
- `yarn hardhat run scripts/deploy.js` --network localhost // Runs the script
  `yarn hardhat node` // Runs local blockchain, very similar to Ganashe, but just in console
- `yarn hardhat clean` // Removes build files(artifacts, cache)
- `yarn hardhat test` // Runs test
- `yarn hardhat test --grep store` // Takes only tests that have the "store" word in the name

### Packages:

- hardhat-gas-reporter // tool for gas calculation
- solidity coverage // tool for checking coverage for Solidity code
- yarn hardhat coverage // shows the coverage of Solidity code, should use `require("solidity-coverage")`
- hardhat-waffle // framework for testing smart contracts
- dotenv // provides us a oportunity to use all variables from .env in `process.env` code
- typechain // provides typescript for smart contracts
- solhint // package for solidity linter

### Debugging:

- Use Run and Debug section

#### Blockchain WebServices:

1. Alchemy - simply saying is a third-party blockchain
2. Aave
