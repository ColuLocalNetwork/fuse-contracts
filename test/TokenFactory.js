const truffleAssert = require('truffle-assertions')
const TokenFactory = artifacts.require("TokenFactory")
const BasicToken = artifacts.require('BasicToken')

contract('TokenFactory', (accounts) => {
  let owner = accounts[0]
  let factory
  let token

  describe('createToken', () => {
    before(async () => {
      factory = await TokenFactory.new()
    })

    describe('should create token with correct params', () => {
      before(async () => {
        const result = await factory.createToken('MacCoin', 'MC', 1e6, 'ipfs://hash')
        let tokenAddress
        truffleAssert.eventEmitted(result, 'TokenCreated', (ev) => {
          tokenAddress = ev.token
          return ev.issuer === owner
        })
        token = await BasicToken.at(tokenAddress)
      })

      it('should have correct name', async () => {
          assert.equal(await token.name(), 'MacCoin')
      })

      it('should have correct symbol', async () => {
          assert.equal(await token.symbol(), 'MC')
      })

      it('should have correct total supply', async () => {
          assert.equal(await token.totalSupply(), 1e6)
      })

      it('should have correct tokenURI', async () => {
          assert.equal(await token.tokenURI(), 'ipfs://hash')
      })

      it('should have correct owner', async () => {
          assert.equal(await token.owner(), owner)
      })

      it('owner should have all the token supply', async () => {
          assert.equal(await token.balanceOf(owner), 1e6)
      })
    })

    describe('create token validations', () => {
      it ('cannot create token without a name', async () => {
        await truffleAssert.fails(
            factory.createToken('', 'MC', 1e6, 'ipfs://hash'),
            truffleAssert.ErrorType.REVERT
        )
      })

      it ('cannot create token without a symbol', async () => {
        await truffleAssert.fails(
            factory.createToken('MacCoin', '', 1e6, 'ipfs://hash'),
            truffleAssert.ErrorType.REVERT
        )
      })

      it ('cannot create token with 0 supply', async () => {
        await truffleAssert.fails(
            factory.createToken('MacCoin', 'MC', 0, 'ipfs://hash'),
            truffleAssert.ErrorType.REVERT
        )
      })

      it ('can create token without tokenURI', async () => {
        await factory.createToken('MacCoin', 'MC', 1e6, '')
      })
    })
  })
})
