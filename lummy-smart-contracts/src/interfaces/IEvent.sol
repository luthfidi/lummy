// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "src/libraries/Structs.sol";

interface IEvent {
    function initialize(
        address _organizer,
        string memory _name,
        string memory _description,
        uint256 _date,
        string memory _venue,
        string memory _ipfsMetadata
    ) external;
    
    function addTicketTier(
        string memory name,
        uint256 price,
        uint256 available,
        uint256 maxPerPurchase
    ) external;
    
    function updateTicketTier(
        uint256 tierId,
        string memory name,
        uint256 price,
        uint256 available,
        uint256 maxPerPurchase
    ) external;
    
    function purchaseTicket(uint256 tierId, uint256 quantity) external;
    
    function setResaleRules(
        uint256 maxMarkupPercentage,
        uint256 organizerFeePercentage,
        bool restrictResellTiming,
        uint256 minDaysBeforeEvent
    ) external;
    
    function listTicketForResale(uint256 tokenId, uint256 price) external;
    
    function purchaseResaleTicket(uint256 tokenId) external;
    
    function getTicketNFT() external view returns (address);
    
    function cancelEvent() external;
    
    // Added getter functions
    function name() external view returns (string memory);
    function description() external view returns (string memory);
    function date() external view returns (uint256);
    function venue() external view returns (string memory);
    function ipfsMetadata() external view returns (string memory);
    function organizer() external view returns (address);
}