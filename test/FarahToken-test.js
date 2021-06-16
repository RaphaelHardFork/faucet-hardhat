const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('FarahToken', function () {
  let FarahToken, farahtoken, dev, owner
  const TOTAL_SUPPLY = ethers.utils.parseEther('100000')
  const ADDRESS_ZERO = ethers.constants.AddressZero
  beforeEach(async function () {
    ;[dev, owner] = await ethers.getSigners()
    FarahToken = await ethers.getContractFactory('FarahToken')
    farahtoken = await FarahToken.connect(dev).deploy(TOTAL_SUPPLY, owner.address)
    await farahtoken.deployed()
  })

  it('should emit a Transfer event [ERC20 event]', async function () {
    expect(farahtoken.deployTransaction)
      .to.emit(farahtoken, 'Transfer')
      .withArgs(ADDRESS_ZERO, owner.address, TOTAL_SUPPLY)
  })

  it('should transfer the supply to owner', async function () {
    expect(await farahtoken.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY)
  })
})
