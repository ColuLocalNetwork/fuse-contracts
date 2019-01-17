pragma solidity ^0.5.0;

import './BasicToken.sol';

contract TokenFactory {
  address[] public tokens;

  event TokenCreated(address indexed token, address indexed issuer);

  function createToken(string memory name, string memory symbol, uint256 initialSupply, string memory tokenURI) public
    returns (address basicTokenAddress) {
    BasicToken basicToken = new BasicToken(name, symbol, initialSupply, tokenURI);
    basicToken.transfer(msg.sender, initialSupply);
    basicToken.transferOwnership(msg.sender);
    basicTokenAddress = address(basicToken);
    tokens.push(basicTokenAddress);
    emit TokenCreated(basicTokenAddress, msg.sender);
  }
}
