// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "src/core/Event.sol";
import "src/core/TicketNFT.sol";

// Stack-safe deployer to avoid "Stack too deep" error
contract EventDeployer {
    // Struct to pack parameters and avoid stack depth issues
    struct DeployParams {
        address sender;
        string name;
        string description;
        uint256 date;
        string venue;
        string ipfsMetadata;
        address idrxToken;
        address platformFeeReceiver;
    }
    
    function deployEventAndTicket(
        DeployParams calldata params
    ) external returns (address eventAddress, address ticketNFTAddress) {
        // Deploy Event
        Event newEvent = new Event();
        
        // Deploy TicketNFT
        TicketNFT newTicketNFT = new TicketNFT();
        
        // Initialize contracts
        _initializeContracts(newEvent, newTicketNFT, params);
        
        return (address(newEvent), address(newTicketNFT));
    }
    
    // Separate function to avoid stack depth issues
    function _initializeContracts(
        Event newEvent,
        TicketNFT newTicketNFT,
        DeployParams calldata params
    ) private {
        // Initialize Event
        newEvent.initialize(
            params.sender,
            params.name,
            params.description,
            params.date,
            params.venue,
            params.ipfsMetadata
        );
        
        // Initialize TicketNFT
        newTicketNFT.initialize(params.name, "TIX", address(newEvent));
        
        // Set up Event with TicketNFT
        newEvent.setTicketNFT(
            address(newTicketNFT),
            params.idrxToken,
            params.platformFeeReceiver
        );
    }
}