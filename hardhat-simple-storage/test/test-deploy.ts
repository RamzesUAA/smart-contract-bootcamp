import { ethers } from "hardhat"
import { expect, assert } from "chai"
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types"

describe("SimpleStorage", () => {
    let simpleStorageFactory: SimpleStorage__factory
    let simpleStorage: SimpleStorage

    beforeEach(async () => {
        simpleStorageFactory = (await ethers.getContractFactory(
            "SimpleStorage"
        )) as SimpleStorage__factory
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async () => {
        const currentValue = await simpleStorage.retrive()

        const expectedValue = "0"

        assert.equal(currentValue.toString(), expectedValue)
        expect(currentValue.toString()).to.equal(expectedValue)
    })
    it("Should update when we call store", async () => {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrive()

        assert.equal(currentValue.toString(), expectedValue)
    })
})
