// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

library Structs {
    // Detail event
    struct EventDetails {
        string name;
        string description;
        uint256 date;
        string venue;
        string ipfsMetadata;
        address organizer;
    }
    
    // Tier tiket
    struct TicketTier {
        string name;
        uint256 price;
        uint256 available;
        uint256 sold;
        uint256 maxPerPurchase;
        bool active;
    }
    
    // Aturan resale
    struct ResaleRules {
        bool allowResell;
        uint256 maxMarkupPercentage;
        uint256 organizerFeePercentage;
        bool restrictResellTiming;
        uint256 minDaysBeforeEvent;
        bool requireVerification;
    }
    
    // Metadata tiket
    struct TicketMetadata {
        uint256 eventId;
        uint256 tierId;
        uint256 originalPrice;
        bool used;
        uint256 purchaseDate;
    }
    
    // Informasi listing marketplace
    struct ListingInfo {
        address seller;
        uint256 price;
        bool active;
        uint256 listingDate;
    }
}