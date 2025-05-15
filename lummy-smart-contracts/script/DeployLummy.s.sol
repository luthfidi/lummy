// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "forge-std/Script.sol";
import "src/core/EventFactory.sol";

contract DeployLummyContract is Script {
    function run() external {
        // Lisk Sepolia IDRX token address
        address idrxAddress = 0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661;

        // Read private key from env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy EventFactory with IDRX address
        EventFactory factory = new EventFactory(idrxAddress);
        
        // Set platform fee receiver - can be changed later
        factory.setPlatformFeeReceiver(vm.addr(deployerPrivateKey));

        vm.stopBroadcast();

        // Log deployment address
        console.log("EventFactory deployed at:", address(factory));
    }
}