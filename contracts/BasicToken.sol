pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/drafts/ERC1046/TokenMetadata.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title BasicToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract BasicToken is ERC20, ERC20Detailed, ERC20WithMetadata, Ownable {
    uint8 public constant DECIMALS = 18;
    /**
     * @dev Constructor that gives msg.sender all of existing tokens,
     * and making him the owner of the token.
     */
    constructor (string memory name, string memory symbol, uint256 initialSupply, string memory tokenURI) public
       ERC20Detailed(name, symbol, DECIMALS)
       ERC20WithMetadata(tokenURI) {
        _mint(msg.sender, initialSupply);
    }
}
