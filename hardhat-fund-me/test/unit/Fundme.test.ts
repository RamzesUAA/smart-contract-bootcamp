import { Contract } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe, MockV3Aggregator } from "../../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { developmentChain } from "../../helper-hardhat-config"

!developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe: Contract
          let deployer: SignerWithAddress
          let mockV3Aggregator: MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              // deployer = (await getNamedAccounts()).deployer

              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe")
              mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
          })

          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async () => {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("Updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer.address
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("Updated the getFunder array", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer.address)
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async () => {
                  // Arrange
                  const startingFoundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)

                  // getCost
                  // Assert
                  assert.equal(endingFundMeBalance.toNumber(), 0)
                  assert.equal(
                      startingFoundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("allows us to withdraw with multiple getFunder", async () => {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFoundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)

                  // Assert
                  assert.equal(endingFundMeBalance.toNumber(), 0)
                  assert.equal(
                      startingFoundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure the fundrs reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 7; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(
                      fundMeConnectedContract,
                      "FundMe__NotOwner"
                  )
              })

              it("cheaper withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFoundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)

                  // Assert
                  assert.equal(endingFundMeBalance.toNumber(), 0)
                  assert.equal(
                      startingFoundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure the fundrs reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 7; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("cheaper withdraw ETH from a single founder", async () => {
                  // Arrange
                  const startingFoundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address)

                  // getCost
                  // Assert
                  assert.equal(endingFundMeBalance.toNumber(), 0)
                  assert.equal(
                      startingFoundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
          })
      })
