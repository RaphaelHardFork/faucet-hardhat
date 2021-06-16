const { ethers } = require('hardhat')
const hre = require('hardhat')
const { readFile } = require('fs/promises')

const TOKEN_CONTRACT_NAME = 'FarahToken'
const FAUCET_CONTRACT_NAME = 'Faucet'

// eslint-disable-next-line space-before-function-paren
async function main() {
  const CONTRACTS_DEPLOYED = JSON.parse(await readFile('./scripts/deployed.json', 'utf-8'))
  const TOKEN_CONTRACT = CONTRACTS_DEPLOYED[TOKEN_CONTRACT_NAME][hre.network.name].address
  const FAUCET_CONTRACT = CONTRACTS_DEPLOYED[FAUCET_CONTRACT_NAME][hre.network.name].address

  const [deployer] = await ethers.getSigners()
  const FarahToken = await hre.ethers.getContractFactory(TOKEN_CONTRACT_NAME)
  const farahtoken = await FarahToken.attach(TOKEN_CONTRACT)

  const TOKEN_SUPPLY = await farahtoken.totalSupply()

  try {
    const tx = await farahtoken.connect(deployer).approve(FAUCET_CONTRACT, TOKEN_SUPPLY.div(2))
    await tx.wait()
    console.log(
      // eslint-disable-next-line comma-dangle
      `Contracts interaction (approve): ${deployer.address} approved ${FAUCET_CONTRACT} for ${TOKEN_SUPPLY.div(2)}`
    )
  } catch (e) {
    console.log(e)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
