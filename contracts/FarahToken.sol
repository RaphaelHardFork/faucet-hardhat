//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FarahToken is ERC20 {
    constructor(uint256 totalSupply_, address owner_) ERC20("FarahToken", "FRT") {
        _mint(owner_, totalSupply_);
    }
}
