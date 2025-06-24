// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

library SecurityLib {
    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        // Implementasi manual dari toEthSignedMessageHash
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        return ECDSA.recover(ethSignedMessageHash, signature);
    }
    
    function validateChallenge(uint256 timestamp, uint256 validityWindow) internal view returns (bool) {
        // Validation logic without using challenge
        if (timestamp > block.timestamp) {
            return false; // Timestamp in the future
        }
        
        if (block.timestamp - timestamp > validityWindow) {
            return false; // Challenge is expired
        }
        
        return true;
    }
}