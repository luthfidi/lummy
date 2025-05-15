// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "src/libraries/Structs.sol";

interface IEventFactory {
    function createEvent(
        string memory name,
        string memory description,
        uint256 date,
        string memory venue,
        string memory ipfsMetadata
    ) external returns (address);
    
    function getEvents() external view returns (address[] memory);
    
    function getEventDetails(address eventAddress) external view returns (Structs.EventDetails memory);
    
    function setPlatformFeeReceiver(address receiver) external;
    
    function getPlatformFeePercentage() external view returns (uint256);
}