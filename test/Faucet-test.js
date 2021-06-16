const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Faucet', function () {
  let Faucet, faucet, FarahToken, farahtoken, dev, owner, alice
  const TOTAL_SUPPLY = ethers.utils.parseEther('100000')
  const TOKEN_RECEIVED = ethers.utils.parseEther('0.1')
  const THREE_DAYS = 86400 * 3

  beforeEach(async function () {
    ;[dev, owner, alice] = await ethers.getSigners()
    FarahToken = await ethers.getContractFactory('FarahToken')
    farahtoken = await FarahToken.connect(dev).deploy(TOTAL_SUPPLY, owner.address)
    await farahtoken.deployed()

    Faucet = await ethers.getContractFactory('Faucet')
    faucet = await Faucet.connect(dev).deploy(farahtoken.address, owner.address, TOKEN_RECEIVED)
    await faucet.deployed()
    await farahtoken.connect(owner).approve(faucet.address, TOTAL_SUPPLY)
  })

  describe('Deployment', function () {
    it('should set the token contract address', async function () {
      expect(await faucet.tokenContractAddress()).to.equal(farahtoken.address)
    })

    it('should set the token owner address', async function () {
      expect(await faucet.tokenOwner()).to.equal(owner.address)
    })

    it('should approved the contract (owner)', async function () {
      expect(await faucet.remainingSupply()).to.equal(TOTAL_SUPPLY)
    })

    it('should set the supply for faucet', async function () {
      expect(await faucet.amountReceived()).to.equal(TOKEN_RECEIVED)
    })
  })

  describe('Get token', function () {
    let GetTokenCall
    beforeEach(async function () {
      GetTokenCall = await faucet.connect(alice).getToken()
    })
    it('should revert if faucet time not reach', async function () {
      await expect(faucet.connect(alice).getToken()).to.revertedWith('Faucet: is available each three days')
    })

    it('should set the time of the call', async function () {
      expect(await faucet.timeRemainingOf(alice.address)).to.above(0)
    })

    it('should get token after 3 days', async function () {
      await ethers.provider.send('evm_increaseTime', [THREE_DAYS])
      await ethers.provider.send('evm_mine')
      expect(await faucet.connect(alice).getToken())
    })

    it('should emit a Transfer event', async function () {
      expect(GetTokenCall).to.emit(farahtoken, 'Transfer').withArgs(owner.address, alice.address, TOKEN_RECEIVED)
    })

    it('should receive tokens', async function () {
      expect(await farahtoken.balanceOf(alice.address)).to.equal(TOKEN_RECEIVED)
    })

    it('should decrease supply for the faucet', async function () {
      expect(await faucet.remainingSupply()).to.equal(TOTAL_SUPPLY.sub(TOKEN_RECEIVED))
    })
  })
})
