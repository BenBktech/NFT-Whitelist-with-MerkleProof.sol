const hre = require("hardhat");
const tokens = require('../utils/tokens.json');
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');

async function main() {
    let tab = [];
    tokens.map((token) => {
        tab.push(token.address)
    })
    const leaves = tab.map((address) => {
        return keccak256(address)
    })
    let tree = new MerkleTree(leaves, keccak256, { sort: true })
    let merkleTreeRoot = tree.getHexRoot();

    let baseURI = 'ipfs://CID/'

    const Alyra = await hre.ethers.deployContract("Alyra", [merkleTreeRoot, baseURI])

    await Alyra.waitForDeployment();

    console.log(`Alyra has been deployed to address : ${Alyra.target} - MerkleRoot ${merkleTreeRoot} - baseURI ${baseURI}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})