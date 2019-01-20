pragma solidity ^0.5.0;

import './BasicToken.sol';

contract TokenFactory {
  event TokenCreated(address indexed token, address indexed issuer);

  function createToken(string memory name, string memory symbol, uint256 initialSupply, string memory tokenURI) public
    returns (address basicTokenAddress) {
    BasicToken basicToken = new BasicToken(name, symbol, initialSupply, tokenURI);
    basicToken.transfer(msg.sender, initialSupply);
    basicToken.transferOwnership(msg.sender);
    basicTokenAddress = address(basicToken);
    emit TokenCreated(basicTokenAddress, msg.sender);
  }
}
