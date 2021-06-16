const { ethers } = require('hardhat')
const hre = require('hardhat')
const { deployed } = require('./deployed')
const { readFile } = require('fs/promises')

const TOKEN_RECEIVED = ethers.utils.parseEther('0.1')
const CONTRACT_NAME = 'Faucet'

// eslint-disable-next-line space-before-function-paren
async function main() {
  const CONTRACTS_DEPLOYED = JSON.parse(await readFile('./scripts/deployed.json', 'utf-8'))
  const TOKEN_CONTRACT = CONTRACTS_DEPLOYED.FarahToken[hre.network.name].address

  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  const Faucet = await hre.ethers.getContractFactory(CONTRACT_NAME)
  const faucet = await Faucet.deploy(TOKEN_CONTRACT, deployer.address, TOKEN_RECEIVED)
  await faucet.deployed()
  await deployed(CONTRACT_NAME, hre.network.name, faucet.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
