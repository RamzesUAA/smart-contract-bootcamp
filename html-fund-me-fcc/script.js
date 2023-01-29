import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
	console.log("@@@@@@@@")
	if (typeof window.ethereum !== "undefined") {
		await window.ethereum.request({ method: "eth_requestAccounts" })
		document.getElementById("connectButton").innerHTML = "Connected!"
	} else {
		console.log("No metamask!")
		document.getElementById("connectButton").innerHTML =
			"Please install metamask!"
	}
}

function listenForTransactionMine(transactionResponse, provider) {
	console.log(`Mining ${transactionResponse.hash}`)

	console.log("#########")
	console.log(transactionResponse)
	console.log("#########")
	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(`Completed with ${transactionReceipt.confirmations}`)
			resolve()
		})
	})
}

async function fund() {
	const ethAmount = document.getElementById("ethAmount").value
	console.log(`Funding with ${ethAmount}....`)
	if (typeof window.ethereum !== "undefined") {
		console.log("FUND")
		// priovider / connection to the blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		// signer / wallet / someone with some gas
		const signer = provider.getSigner()
		console.log(signer)
		// contract that we are interacting with
		// ^ ABI & Address
		const contract = new ethers.Contract(contractAddress, abi, signer)

		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			})

			await listenForTransactionMine(transactionResponse, provider)
			console.log("DONE!")
			// listen for the tx to be mined
			// listen for an event
		} catch (error) {
			console.log(error)
		}
	}

	// 13:21:15
}

async function getBalance() {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const balance = await provider.getBalance(contractAddress)
		console.log(ethers.utils.formatEther(balance))
	}
}

// Withdraw

async function withdraw() {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, abi, signer)
		try {
			const transactionResponse = await contract.withdraw()
			await listenForTransactionMine(transactionResponse, provider)
		} catch (error) {
			console.log(error)
		}
	}
}
