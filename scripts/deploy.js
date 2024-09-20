
const hre = require("hardhat")
const path = require("path")
const fs = require("fs")

async function main() {
    console.log("Deployement started!")

    const [deployer] = await ethers.getSigners()
    const address = await deployer.getAddress()
    console.log(`Deploying the contract with the account: ${address}`)

    const Vote = await hre.ethers.getContractFactory("NFT")
    const contract = await Vote.deploy()
    const contractAddress = await contract.getAddress()

    console.log(`NFT deployed to ${contractAddress}`)

    saveContractFiles(contract)
}

function saveContractFiles(contract) {
    const contractDir = path.join(__dirname,"..", "src", "contracts")

    if(!fs.existsSync(contractDir)) {
        fs.mkdirSync(contractDir)
    }

    fs.writeFileSync(
        path.join(contractDir, `contract-address-${hre.network.name}.json`),
        JSON.stringify({NFT: contract.target}, null, 2)
    )

    const VoteArtifact = hre.artifacts.readArtifactSync("NFT")

    fs.writeFileSync(
        path.join(contractDir, "NFT.json"),
        JSON.stringify(VoteArtifact, null, 2)
    )

}

main().catch(error => {
    console.log(error)
    process.exitCode = 1
})


// npx hardhat run scripts/deploy.js 