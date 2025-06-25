// SPDX-License-Identifier: MIT
// use for testing purpose

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockIDRX is ERC20 {
    constructor() ERC20("Indonesian Rupiah X", "IDRX") {
        _mint(msg.sender, 1000000000 * 10**18); // 1B tokens
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}