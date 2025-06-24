// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "./Structs.sol";
import "./Constants.sol";

library TicketLib {
    function validateTicketPurchase(
        Structs.TicketTier memory tier,
        uint256 quantity
    ) internal pure returns (bool) {
        // Validasi bahwa tier aktif, dan kuantitas valid
        require(tier.active, "Ticket tier is not active");
        require(quantity > 0, "Quantity must be greater than zero");
        require(quantity <= tier.maxPerPurchase, "Quantity exceeds max per purchase");
        require(tier.available - tier.sold >= quantity, "Not enough tickets available");
        
        return true;
    }
    
    function calculateFees(
        uint256 price,
        uint256 organizerFeePercentage,
        uint256 platformFeePercentage
    ) internal pure returns (uint256 organizerFee, uint256 platformFee) {
        organizerFee = (price * organizerFeePercentage) / Constants.BASIS_POINTS;
        platformFee = (price * platformFeePercentage) / Constants.BASIS_POINTS;
        
        return (organizerFee, platformFee);
    }
    
    function validateResalePrice(
        uint256 originalPrice,
        uint256 resalePrice,
        uint256 maxMarkupPercentage
    ) internal pure returns (bool) {
        // Validasi bahwa harga resale tidak melebihi maksimum markup
        uint256 maxPrice = originalPrice + ((originalPrice * maxMarkupPercentage) / Constants.BASIS_POINTS);
        require(resalePrice <= maxPrice, "Resale price exceeds maximum allowed markup");
        
        return true;
    }
}