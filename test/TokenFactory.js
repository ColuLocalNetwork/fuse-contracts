const truffleAssert = require('truffle-assertions')
const TokenFactory = artifacts.require("TokenFactory")
const BasicToken = artifacts.require('BasicToken')
const MintableBurnableToken = artifacts.require('MintableBurnableToken')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'


const createTokenWrapper = async (createToken, ...args) => {
  const result = await createToken(...args)
  let tokenAddress
  truffleAssert.eventEmitted(result, 'TokenCreated', (ev) => {
    tokenAddress = ev.token
    return true
  })
  return {tokenAddress, result}
}

contract('TokenFactory', (accounts) => {
  let owner = accounts[0]
  let factory
  let token

  before(async () => {
    factory = await TokenFactory.new()
  })

  describe('token creation', () => {

    const factoryFunctions = {
      createToken: () => factory.createToken,
      createMintableBurnableToken: () => factory.createMintableBurnableToken
    }

    Object.entries(factoryFunctions).forEach(([name, functionCreator]) => {
      let createToken
      describe(`Basic functionality for ${name} token`, () => {
        before(() => {
          createToken = functionCreator()
        })

        describe(`should create token with correct params`, () => {
          before(async () => {
            const {tokenAddress, result} = await createTokenWrapper(createToken, 'MacCoin', 'MC', 1e6, 'ipfs://hash')
            truffleAssert.eventEmitted(result, 'TokenCreated', (ev) => {
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
                createToken('', 'MC', 1e6, 'ipfs://hash'),
                truffleAssert.ErrorType.REVERT
            )
          })

          it ('cannot create token without a symbol', async () => {
            await truffleAssert.fails(
                createToken('MacCoin', '', 1e6, 'ipfs://hash'),
                truffleAssert.ErrorType.REVERT
            )
          })

          it ('cannot create token with 0 supply', async () => {
            await truffleAssert.fails(
                createToken('MacCoin', 'MC', 0, 'ipfs://hash'),
                truffleAssert.ErrorType.REVERT
            )
          })

          it ('can create token without tokenURI', async () => {
            await createToken('MacCoin', 'MC', 1e6, '')
          })
        })
      })
    })
  })

  describe('Burnable', () => {
    beforeEach(async () => {
      const {tokenAddress} = await createTokenWrapper(
        factory.createMintableBurnableToken, 'MacCoin', 'MC', 1e6, 'ipfs://hash', {from: owner}
      )
      token = await MintableBurnableToken.at(tokenAddress)
    })

    it('owner can burn his tokens', async () => {
        const result = await token.burn(1e5, {from: owner})
        truffleAssert.eventEmitted(result, 'Transfer',
          ev => ev.from === owner && ev.to === ZERO_ADDRESS
        )
        assert.equal(await token.balanceOf(owner), 9e5)
        assert.equal(await token.totalSupply(), 9e5)
    })

    it('owner cannot burn more than his balance', async () => {
        await truffleAssert.fails(token.burn(1e7, {from: owner}))
        assert.equal(await token.balanceOf(owner), 1e6)
    })
  })

  describe('Mintable', () => {
    it('should change minter to the token owner', async () => {
      const {tokenAddress, result} = await createTokenWrapper(
        factory.createMintableBurnableToken, 'MacCoin', 'MC', 1e6, 'ipfs://hash', {from: owner}
      )
      console.log(result)
      truffleAssert.eventEmitted(result, 'MinterAdded')
      // truffleAssert.eventEmitted(result, 'MinterAdded', (ev) => {
      //   return ev.account === owner
      // })
    })
  })

})
