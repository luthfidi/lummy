// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "src/core/Event.sol";
import "src/core/TicketNFT.sol";

// Helper contract to deploy Event and TicketNFT - reduce EventFactory bytecode size
contract EventDeployer {
    function deployEventAndTicket(
        address sender,
        string memory _name,
        string memory _description,
        uint256 _date,
        string memory _venue,
        string memory _ipfsMetadata,
        address idrxToken,
        address platformFeeReceiver
    ) external returns (address eventAddress, address ticketNFTAddress) {
        // Deploy Event and TicketNFT contracts
        Event newEvent = new Event();
        newEvent.initialize(sender, _name, _description, _date, _venue, _ipfsMetadata);
        
        TicketNFT newTicketNFT = new TicketNFT();
        newTicketNFT.initialize(_name, "TIX", address(newEvent));
        
        newEvent.setTicketNFT(address(newTicketNFT), idrxToken, platformFeeReceiver);
        
        return (address(newEvent), address(newTicketNFT));
    }
}