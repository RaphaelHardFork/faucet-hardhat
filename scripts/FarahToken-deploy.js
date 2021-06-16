const { ethers } = require('hardhat')
const hre = require('hardhat')
const { deployed } = require('./deployed')

const TOTAL_SUPPLY = ethers.utils.parseEther('1000000')
const CONTRACT_NAME = 'FarahToken'

// eslint-disable-next-line space-before-function-paren
async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  const FarahToken = await hre.ethers.getContractFactory(CONTRACT_NAME)
  const farahtoken = await FarahToken.deploy(TOTAL_SUPPLY, deployer.address)
  await farahtoken.deployed()
  await deployed(CONTRACT_NAME, hre.network.name, farahtoken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
