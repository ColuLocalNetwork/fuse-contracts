var BasicToken = artifacts.require("./BasicToken.sol");
var TokenFactory = artifacts.require("./TokenFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenFactory)
};
